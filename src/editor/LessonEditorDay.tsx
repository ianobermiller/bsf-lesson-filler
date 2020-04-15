import {css} from 'emotion';
import React, {useContext} from 'react';
import {LessonDay} from '../api/LessonAPI';
import TextWithBibleReferences from '../components/TextWithBibleReferences';
import {SelectedPassageContext} from './LessonEditor';
import {LessonEditorQuestion} from './LessonEditorQuestion';

type Props = {
  answersByQuestionID: Map<string, string>;
  day: LessonDay;
};

export function LessonEditorDay({answersByQuestionID, day}: Props) {
  const setSelectedPassage = useContext(SelectedPassageContext);
  return (
    <div>
      <h2 className={styles.dayHeading}>
        <TextWithBibleReferences
          text={day.title}
          onPassageClicked={setSelectedPassage}
        />
      </h2>
      <i>{day.note}</i>
      {day.questions.map(question => (
        <LessonEditorQuestion
          savedAnswer={answersByQuestionID.get(question.id) ?? ''}
          key={question.id}
          question={question}
        />
      ))}
    </div>
  );
}

const styles = {
  dayHeading: css`
    font-size: var(--font-size-l);
  `,
};
