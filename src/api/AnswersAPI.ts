import firebase from 'firebase';
import {db} from '../Firebase';

type Answer = {
  answerText: string;
};

export async function fetchAnswersByQuestionID(
  userID: string,
): Promise<Map<string, string>> {
  const querySnapshot = await db
    .collection('users')
    .doc(userID)
    .collection('answers')
    .get();

  return new Map(
    querySnapshot.docs.map(doc => {
      const data = doc.data() as Answer;
      return [doc.id, data.answerText];
    }),
  );
}

export function subscribeToAnswersByQuestionID(
  userID: string,
  onSnapshot: (answers: Map<string, string>) => void,
): () => void {
  return db
    .collection('users')
    .doc(userID)
    .collection('answers')
    .onSnapshot({
      next(querySnapshot) {
        onSnapshot(
          new Map(
            querySnapshot.docs.map(doc => {
              const data = doc.data() as Answer;
              return [doc.id, data.answerText];
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
  return db
    .collection('users')
    .doc(userID)
    .collection('answers')
    .doc(questionID)
    .set(
      {
        answerText,
      } as Answer,
      {merge: true},
    );
}

export async function migrateUser(
  anonymousUser: firebase.User,
  newCreds: firebase.auth.AuthCredential,
): Promise<void> {
  const anonymousAnswers = await fetchAnswersByQuestionID(anonymousUser.uid);
  const newUser = await firebase.auth().signInWithCredential(newCreds);
  if (newUser.user) {
    const realAnswers = await fetchAnswersByQuestionID(newUser.user.uid);
    console.log(anonymousAnswers, realAnswers);
    const batch = db.batch();
    for (const [questionID, answer] of anonymousAnswers) {
      const realAnswer = realAnswers.get(questionID);
      const mergedAnswer = realAnswer ? realAnswer + '\n\n' + answer : answer;
      batch.set(
        db
          .collection('users')
          .doc(newUser.user.uid)
          .collection('answers')
          .doc(questionID),
        {answerText: mergedAnswer} as Answer,
        {merge: true},
      );
    }
    await batch.commit();
  }
  await anonymousUser.delete();
}
