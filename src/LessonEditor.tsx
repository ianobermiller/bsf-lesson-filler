import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchLesson, Lesson} from './API';

export function LessonEditor({lessonID}: {lessonID: string}): JSX.Element {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchLesson(lessonID, controller.signal).then(setLesson);
    return () => {
      controller.abort();
    };
  }, [lessonID]);

  if (!lesson) {
    return <div className={styles.lessonEditor} />;
  }

  return (
    <div className={styles.lessonEditor}>
      <h1 className={styles.title}>
        {lesson.verses} - Lesson {lesson.number}
      </h1>
      {Object.entries(lesson.dayQuestions).map(([dayKey, day]) => {
        return (
          <div key={dayKey}>
            <h2 className={styles.dayHeading}>{day.title}</h2>
            {day.questions.map(question => {
              return (
                <div key={question.id}>
                  <h3 className={styles.question}>{question.questionText}</h3>
                  <textarea className={styles.textarea} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  lessonEditor: css`
    flex: 1 1 auto;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;
  `,
  title: css`
    font-size: var(--font-size-xl);
  `,
  dayHeading: css`
    font-size: var(--font-size-l);
  `,
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
