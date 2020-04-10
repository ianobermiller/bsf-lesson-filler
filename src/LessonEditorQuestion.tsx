import {css} from 'emotion';
import React, {useRef} from 'react';
import {Question} from './API';
import TextWithBibleVerses from './TextWithBibleVerses';

export function LessonEditorQuestion({question}: {question: Question}) {
  const verseRef = useRef<HTMLDivElement>(null);
  return (
    <div key={question.id}>
      <h3 className={styles.question}>
        <TextWithBibleVerses text={question.questionText} verseRef={verseRef} />
      </h3>
      <div ref={verseRef}></div>
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
    color: var(--content-primary);
    font-family: system-ui;
    font-size: var(--font-size-m);
    height: 100px;
    padding: var(--s);
    width: 400px;
  `,
};
