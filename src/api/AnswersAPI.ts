import * as Base64 from 'js-base64';
import {FirebaseConfig} from '../Firebase';
import {User} from '../hooks/useCurrentUser';
import {fetchJSON} from './APIUtils';

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

function getAnswersURL(userID: string): string {
  return (
    'https://firestore.googleapis.com/v1/projects/' +
    FirebaseConfig.projectId +
    '/databases/(default)/documents/users/' +
    userID +
    '/answers'
  );
}

interface FetchAnswersResponse {
  documents?: Array<AnswerDoc>;
}

export async function fetchAnswersByQuestionID(
  user: User,
): Promise<Map<string, string>> {
  const url = getAnswersURL(user.id) + '?pageSize=1000';
  const json = await fetchJSON<FetchAnswersResponse>({
    url,
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
    defaultErrorMessage: 'Could not load answers',
  });

  if (!json.documents) {
    // No answers saved yet
    return new Map();
  }

  return new Map(
    json.documents.map(doc => {
      const split = doc.name.split('/');
      const questionID = split[split.length - 1];
      const answer = {
        encoding: doc.fields.encoding?.stringValue,
        answerText: doc.fields.answerText.stringValue,
      };
      return [questionID, decodeAnswer(answer).trim()];
    }),
  );
}

function decodeAnswer(answer: Answer): string {
  switch (answer.encoding) {
    case 'base64':
      try {
        return Base64.decode(answer.answerText);
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
  return {answerText: Base64.encode(text), encoding: 'base64'};
}

export async function saveAnswer(
  user: User,
  questionID: string,
  answerText: string,
): Promise<void> {
  const answer = encodeAnswer(answerText.trim());
  const url = getAnswersURL(user.id) + '/' + questionID;
  return await fetchJSON({
    url,
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
    body: JSON.stringify({
      fields: {
        encoding: {stringValue: answer.encoding},
        answerText: {stringValue: answer.answerText},
      },
    }),
    method: 'PATCH',
    defaultErrorMessage: 'Failed to save answer',
  });
}

export async function saveAllAnswers(
  userID: string,
  answerByQuestionID: Map<string, string>,
): Promise<void> {}
