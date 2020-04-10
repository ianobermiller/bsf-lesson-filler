import {css} from 'emotion';
import React from 'react';
import {LessonDay} from './API';
import {LessonEditorQuestion} from './LessonEditorQuestion';

export function LessonEditorDay({day}: {day: LessonDay}) {
  return (
    <div>
      <h2 className={styles.dayHeading}>{day.title}</h2>
      <i>{day.note}</i>
      {day.questions.map(question => (
        <LessonEditorQuestion key={question.id} question={question} />
      ))}
    </div>
  );
}

const styles = {
  dayHeading: css`
    font-size: var(--font-size-l);
  `,
};
