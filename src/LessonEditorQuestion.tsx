import {css} from 'emotion';
import React, {useContext} from 'react';
import {Question} from './API';
import {SelectedVerseContext} from './LessonEditor';
import TextWithBibleVerses from './TextWithBibleVerses';

export function LessonEditorQuestion({question}: {question: Question}) {
  const setSelectedVerse = useContext(SelectedVerseContext);
  return (
    <div key={question.id}>
      <h3 className={styles.question}>
        <TextWithBibleVerses
          text={question.questionText}
          onVerseClicked={setSelectedVerse}
        />
      </h3>
      <textarea className={styles.textarea} />
    </div>
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
