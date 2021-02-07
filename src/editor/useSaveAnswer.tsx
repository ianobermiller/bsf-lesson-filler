import {useCallback, useEffect, useState} from 'react';
import {saveAnswer} from '../api/AnswersAPI';
import {useCurrentUser, User} from '../hooks/useCurrentUser';
import useDebounced from '../hooks/useDebounced';

const SAVE_DEBOUNCE_MS = 1000;

export type SaveState =
  | {
      type: 'none';
    }
  | {
      type: 'saving';
    }
  | {
      type: 'saved';
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
  const [saveState, setSaveState] = useState<SaveState>({type: 'none'});
  const {currentUser} = useCurrentUser();
  const saveAnswerWrapped = useCallback(
    (user: User, questionID: string, answerText: string) => {
      saveAnswer(user, questionID, answerText)
        .then(() => setSaveState({type: 'saved'}))
        .catch(error => {
          setSaveState({type: 'error', error});
          // Save to local storage on failure
          localStorage.setItem(
            `answer-backup-${questionID}`,
            // Stringify for backwards compatibility
            JSON.stringify(answerText),
          );
        });
    },
    [],
  );
  const saveAnswerDebounced = useDebounced(saveAnswerWrapped, SAVE_DEBOUNCE_MS);

  useEffect(() => {
    if (areAnswersLoaded && currentUser && answer !== savedAnswer) {
      setSaveState({type: 'saving'});
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
