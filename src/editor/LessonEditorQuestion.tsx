import {css} from 'emotion';
import React, {useContext, useEffect, useState} from 'react';
import {Question} from '../api/LessonAPI';
import TextWithBibleReferences from '../components/TextWithBibleReferences';
import {db} from '../Firebase';
import {useCurrentUser} from '../hooks/useCurrentUser';
import useDebounced from '../hooks/useDebounced';
import {SelectedPassageContext} from './LessonEditor';

const SAVE_DEBOUNCE_MS = 2000;

type Props = {
  question: Question;
  savedAnswer: string;
};

export function LessonEditorQuestion({question, savedAnswer}: Props) {
  const setSelectedPassage = useContext(SelectedPassageContext);
  const [answer, setAnswer] = useState<string>(savedAnswer);
  const [previousSavedAnswer, setPreviousSavedAnswer] = useState<string>(
    savedAnswer,
  );

  if (savedAnswer !== previousSavedAnswer) {
    setAnswer(savedAnswer);
    setPreviousSavedAnswer(savedAnswer);
  }

  // Save data to Firebase
  useSaveAnswer({answer, questionID: question.id, savedAnswer});

  function onChange(e: React.FormEvent<HTMLTextAreaElement>) {
    setAnswer(e.currentTarget.value);
  }

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
        value={answer}
        onChange={onChange}
      />
    </div>
  );
}

function useSaveAnswer({
  answer,
  questionID,
  savedAnswer,
}: {
  answer: string;
  questionID: string;
  savedAnswer: string;
}) {
  const currentUser = useCurrentUser();
  const saveAnswerDebounced = useDebounced(
    saveAnswerToFirebase,
    SAVE_DEBOUNCE_MS,
  );

  useEffect(() => {
    if (currentUser && answer && answer !== savedAnswer) {
      saveAnswerDebounced(currentUser.uid, questionID, answer);
    }
  }, [answer, currentUser, questionID, saveAnswerDebounced, savedAnswer]);
}

function saveAnswerToFirebase(
  userID: string,
  questionID: string,
  answerText: string,
) {
  db.collection('users').doc(userID).collection('answers').doc(questionID).set(
    {
      answerText,
    },
    {merge: true},
  );
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
    height: 100px;
    padding: var(--s);
    width: 100%;
  `,
};
