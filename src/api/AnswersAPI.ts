import type {User} from 'firebase';
import {auth, db} from '../Firebase';

type Answer = {
  answerText: string;
  encoding?: 'base64';
};

function userDoc(userID: string) {
  return db.collection('users').doc(userID);
}

function answersCollection(userID: string) {
  return userDoc(userID).collection('answers');
}

function answerDoc(userID: string, questionID: string) {
  return answersCollection(userID).doc(questionID);
}

export async function fetchAnswersByQuestionID(
  userID: string,
): Promise<Map<string, string>> {
  const querySnapshot = await answersCollection(userID).get();

  return new Map(
    querySnapshot.docs.map(doc => {
      const data = doc.data() as Answer;
      return [doc.id, decodeAnswer(data)];
    }),
  );
}

function decodeAnswer(answer: Answer): string {
  switch (answer.encoding) {
    case 'base64':
      try {
        return atob(answer.answerText);
      } catch {
        console.log('Could not decode answer: ', answer);
        return '';
      }
  }
  return answer.answerText;
}

function encodeAnswer(text: string): Answer {
  // Simple obfuscation so the text isn't trivially readable. Not intended
  // to be secure, just so that you don't accidentally read a user's private
  // thoughts while viewing the database.
  return {answerText: btoa(text), encoding: 'base64'};
}

export function subscribeToAnswersByQuestionID(
  userID: string,
  onSnapshot: (answers: Map<string, string>) => void,
): () => void {
  return answersCollection(userID).onSnapshot({
    next(querySnapshot) {
      onSnapshot(
        new Map(
          querySnapshot.docs.map(doc => {
            const data = doc.data() as Answer;
            return [doc.id, decodeAnswer(data)];
          }),
        ),
      );
    },
  });
}

export async function saveAnswer(
  userID: string,
  questionID: string,
  answerText: string,
): Promise<void> {
  return answerDoc(userID, questionID).set(encodeAnswer(answerText), {
    merge: true,
  });
}

export async function saveAllAnswers(
  userID: string,
  answerByQuestionID: Map<string, string>,
): Promise<void> {
  // Delete the anonymous user's data
  let batch = db.batch();
  for (const [questionID, answer] of answerByQuestionID) {
    batch.set(answerDoc(userID, questionID), encodeAnswer(answer));
  }
  batch.delete(userDoc(userID));
  return batch.commit();
}

export async function migrateUser(
  anonymousUser: User,
  newCreds: firebase.auth.AuthCredential,
): Promise<void> {
  const anonymousAnswers = await fetchAnswersByQuestionID(anonymousUser.uid);

  // Delete the anonymous user's data
  let batch = db.batch();
  for (const questionID of anonymousAnswers.keys()) {
    batch.delete(answerDoc(anonymousUser.uid, questionID));
  }
  batch.delete(userDoc(anonymousUser.uid));
  await batch.commit();

  // Migrate the anonymous user's data to the real user
  const newUser = await auth.signInWithCredential(newCreds);
  const newUserID = newUser.user!.uid;
  const realAnswers = await fetchAnswersByQuestionID(newUserID);
  batch = db.batch();
  for (const [questionID, anonymousAnswer] of anonymousAnswers) {
    const realAnswer = realAnswers.get(questionID);
    const mergedAnswer = realAnswer
      ? realAnswer + '\n\n' + anonymousAnswer
      : anonymousAnswer;
    batch.set(answerDoc(newUserID, questionID), encodeAnswer(mergedAnswer), {
      merge: true,
    });
  }
  await batch.commit();

  await anonymousUser.delete();
}
