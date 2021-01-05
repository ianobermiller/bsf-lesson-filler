import {css} from 'emotion';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {saveAnswer} from '../api/AnswersAPI';
import {Question} from '../api/LessonAPI';
import TextWithBibleReferences from '../components/TextWithBibleReferences';
import {useCurrentUser} from '../hooks/useCurrentUser';
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
  useSaveAnswer({
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
    <div key={question.id}>
      <h3 className={styles.question}>
        <TextWithBibleReferences
          text={question.questionText}
          onPassageClicked={setSelectedPassage}
        />
      </h3>
      <textarea
        className={styles.textarea}
        onChange={onChange}
        ref={textAreaRef}
        rows={2}
        value={answer}
      />
    </div>
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
  const {currentUser} = useCurrentUser();
  const saveAnswerDebounced = useDebounced(saveAnswer, SAVE_DEBOUNCE_MS);

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
}

const styles = {
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
};
