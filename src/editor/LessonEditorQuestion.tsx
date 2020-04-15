import debounce from 'debounce';
import {css} from 'emotion';
import firebase, {User} from 'firebase';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Question} from '../api/LessonAPI';
import TextWithBibleReferences from '../components/TextWithBibleReferences';
import {app, auth} from '../Firebase';
import {SelectedPassageContext} from './LessonEditor';

const SAVE_DEBOUNCE_MS = 2000;

const db = firebase.firestore(app);

export function LessonEditorQuestion({question}: {question: Question}) {
  const setSelectedPassage = useContext(SelectedPassageContext);
  const currentUser = useCurrentUser();
  const [answer, setAnswer] = useState<string>('');
  const lastSavedAnswerRef = useRef<string>(answer);

  // Load data from Firebase
  useEffect(() => {
    if (currentUser) {
      debugger;
      db.collection('users')
        .doc(currentUser.uid)
        .collection('answers')
        .doc(question.id)
        .get()
        .then(result => {
          if (result.exists) {
            const answerText = String(result.data()?.answerText);
            lastSavedAnswerRef.current = answerText;
            setAnswer(answerText);
          }
        });
    }
  }, [currentUser, question.id]);

  // Save data to Firebase
  useEffect(() => {
    if (currentUser && answer && answer !== lastSavedAnswerRef.current) {
      lastSavedAnswerRef.current = answer;
      debounce(() => {
        db.collection('users')
          .doc(currentUser.uid)
          .collection('answers')
          .doc(question.id)
          .set(
            {
              answerText: answer,
              uid: currentUser.uid,
            },
            {merge: true},
          );
      }, SAVE_DEBOUNCE_MS);
    }
  }, [answer, currentUser, question.id]);

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

function useCurrentUser(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    return auth.onAuthStateChanged(setCurrentUser);
  }, []);
  return currentUser;
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
