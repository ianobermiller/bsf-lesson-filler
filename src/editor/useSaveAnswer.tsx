import {useCallback, useEffect, useState} from 'react';
import {saveAnswer} from '../api/AnswersAPI';
import {useCurrentUser, User} from '../hooks/useCurrentUser';
import useDebounced from '../hooks/useDebounced';
import {SAVE_DEBOUNCE_MS} from './LessonEditorQuestion';

export type SaveState =
  | {
      type: 'saving';
    }
  | {
      type: 'saved';
      timestamp: number;
    }
  | {
      type: 'error';
      error: Error;
    };

export function useSaveAnswer({
  answer,
  areAnswersLoaded,
  questionID,
  savedAnswer,
}: {
  answer: string;
  areAnswersLoaded: boolean;
  questionID: string;
  savedAnswer: string;
}) {
  const [saveState, setSaveState] = useState<SaveState>({
    type: 'saved',
    timestamp: 0,
  });
  const {currentUser} = useCurrentUser();
  const saveAnswerWrapped = useCallback(
    (user: User, questionID: string, answerText: string) => {
      setSaveState({type: 'saving'});
      saveAnswer(user, questionID, answerText)
        .then(() => setSaveState({type: 'saved', timestamp: Date.now()}))
        .catch(error => setSaveState({type: 'error', error}));
    },
    [],
  );
  const saveAnswerDebounced = useDebounced(saveAnswerWrapped, SAVE_DEBOUNCE_MS);

  useEffect(() => {
    if (areAnswersLoaded && currentUser && answer !== savedAnswer) {
      saveAnswerDebounced(currentUser, questionID, answer);
    }
  }, [
    answer,
    areAnswersLoaded,
    currentUser,
    questionID,
    saveAnswerDebounced,
    savedAnswer,
  ]);
  return saveState;
}
