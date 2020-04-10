import {css} from 'emotion';
import React, {useContext} from 'react';
import {LessonDay} from './API';
import {SelectedVerseContext} from './LessonEditor';
import {LessonEditorQuestion} from './LessonEditorQuestion';
import TextWithBibleVerses from './TextWithBibleVerses';

export function LessonEditorDay({day}: {day: LessonDay}) {
  const setSelectedVerse = useContext(SelectedVerseContext);
  return (
    <div>
      <h2 className={styles.dayHeading}>
        <TextWithBibleVerses
          text={day.title}
          onVerseClicked={setSelectedVerse}
        />
      </h2>
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
