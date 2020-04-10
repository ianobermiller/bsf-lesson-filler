import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchLesson, Lesson, Study} from './API';
import {LessonEditorDay} from './LessonEditorDay';

export function LessonEditor({
  lessonID,
  studies,
}: {
  lessonID: string;
  studies: Study[];
}): JSX.Element {
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

  const verses = studies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
    ?.verses;

  return (
    <div className={styles.lessonEditor}>
      <h1 className={styles.title}>
        {verses} - Lesson {lesson.number}
      </h1>
      {lesson.days.map((day, index) => (
        <LessonEditorDay day={day} key={index} />
      ))}
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
};
