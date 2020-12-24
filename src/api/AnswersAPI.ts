import {FirebaseConfig} from '../Firebase';

interface Answer {
  answerText: string;
  encoding?: 'base64';
}

interface AnswerDoc {
  name: string;
  fields: {
    encoding?: {stringValue: 'base64'};
    answerText: {stringValue: string};
  };
}

export async function fetchAnswersByQuestionID(
  userID: string,
  idToken: string,
): Promise<Map<string, string>> {
  const url = `https://firestore.googleapis.com/v1beta1/projects/${FirebaseConfig.projectId}/databases/(default)/documents/users/${userID}/answers`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const json = await response.json();
  return new Map(
    json.documents.map((doc: AnswerDoc) => {
      const split = doc.name.split('/');
      const questionID = split[split.length - 1];
      const answer = {
        encoding: doc.fields.encoding?.stringValue,
        answerText: doc.fields.answerText.stringValue,
      };
      return [questionID, decodeAnswer(answer)];
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

export async function saveAnswer(
  userID: string,
  questionID: string,
  answerText: string,
): Promise<void> {}

export async function saveAllAnswers(
  userID: string,
  answerByQuestionID: Map<string, string>,
): Promise<void> {}
