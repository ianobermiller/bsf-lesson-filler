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
