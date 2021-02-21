import {css} from 'emotion';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Question} from '../api/LessonAPI';
import TextWithBibleReferences from '../components/TextWithBibleReferences';
import {SelectedPassageContext} from './LessonEditor';
import {SaveIndicator} from './SaveIndicator';
import {useSaveAnswer} from './useSaveAnswer';

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
  const [answer, setAnswer] = useState(savedAnswer);

  useEffect(() => {
    const answerBackup = localStorage.getItem(`answer-backup-${question.id}`);
    if (answerBackup) {
      const parsed = JSON.parse(answerBackup);
      localStorage.removeItem(`answer-backup-${question.id}`);
      if (parsed) {
        setAnswer(existing => [existing, parsed].join('\n\n').trim());
      }
    }
  }, [question.id]);

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
      <SaveIndicator saveState={saveState} />
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
};
