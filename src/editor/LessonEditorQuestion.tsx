import {css} from 'emotion';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {saveAnswer} from '../api/AnswersAPI';
import {Question} from '../api/LessonAPI';
import TextWithBibleReferences from '../components/TextWithBibleReferences';
import {useCurrentUser, User} from '../hooks/useCurrentUser';
import useDebounced from '../hooks/useDebounced';
import useLocalStorage from '../hooks/useLocalStorage';
import {SelectedPassageContext} from './LessonEditor';

const SAVE_DEBOUNCE_MS = 2000;

type Props = {
  areAnswersLoaded: boolean;
  question: Question;
  savedAnswer: string;
};

export function LessonEditorQuestion({
  areAnswersLoaded,
  question,
  savedAnswer,
}: Props) {
  const setSelectedPassage = useContext(SelectedPassageContext);
  const [answer, setAnswer] = useLocalStorage<string>(
    `answer-backup-${question.id}`,
    savedAnswer,
  );

  // Update local answer when a new one is loaded
  const [previousSavedAnswer, setPreviousSavedAnswer] = useState<string>(
    savedAnswer,
  );
  if (savedAnswer && savedAnswer !== previousSavedAnswer) {
    setAnswer(savedAnswer);
    setPreviousSavedAnswer(savedAnswer);
  }

  // Save data to Firebase
  const saveState = useSaveAnswer({
    answer,
    areAnswersLoaded,
    questionID: question.id,
    savedAnswer,
  });
  function onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    setAnswer(e.currentTarget.value);
  }

  // Auto resize when answer changes
  const textAreaRef = useAutoResize(answer);

  return (
    <label className={styles.root} key={question.id}>
      <h3 className={styles.question}>
        <TextWithBibleReferences
          text={question.questionText}
          onPassageClicked={setSelectedPassage}
        />
      </h3>
      <div className={styles.saveState}>{saveState.type}</div>
      <textarea
        className={styles.textarea}
        onChange={onChange}
        ref={textAreaRef}
        rows={2}
        value={answer}
      />
    </label>
  );
}

function useAutoResize(content: string) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (!textArea) {
      return;
    }
    // Revert to default height
    textArea.style.height = '';
    // Set height to scroll height
    textArea.style.height = textArea.scrollHeight + 'px';
  }, [content]);
  return textAreaRef;
}

type SaveState =
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

function useSaveAnswer({
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

const styles = {
  root: css`
    position: relative;
  `,
  question: css`
    font-size: var(--font-size-m);
    font-weight: normal;
  `,
  textarea: css`
    background: var(--control-background);
    border-radius: var(--radius-s);
    border: none;
    box-sizing: border-box;
    color: var(--content-primary);
    font-family: system-ui;
    font-size: var(--font-size-m);
    padding: var(--s);
    width: 100%;
  `,
  saveState: css`
    position: absolute;
    right: 0;
  `,
};
