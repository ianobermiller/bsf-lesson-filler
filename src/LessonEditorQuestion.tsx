import {css} from 'emotion';
import React, {useContext} from 'react';
import {Question} from './API';
import {SelectedPassageContext} from './LessonEditor';
import TextWithBibleReferences from './TextWithBibleReferences';
import useLocalStorage from './useLocalStorage';

export function LessonEditorQuestion({question}: {question: Question}) {
  const setSelectedPassage = useContext(SelectedPassageContext);
  const [answer, setAnswer] = useLocalStorage<string>(
    `answer-${question.id}`,
    '',
  );
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
        onChange={e => setAnswer(e.currentTarget.value)}
      />
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
