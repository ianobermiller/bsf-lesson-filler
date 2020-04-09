import { css } from "emotion";
import React, { useEffect, useState } from "react";
import { fetchLesson, Lesson } from "./API";

export function LessonEditor({ lessonID }: { lessonID: string }): JSX.Element {
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
      <h1>
        {lesson.verses} - Lesson {lesson.number}
      </h1>
      {Object.entries(lesson.dayQuestions).map(([dayKey, day]) => {
        return (
          <div key={dayKey}>
            <h2>{day.title}</h2>
            {day.questions.map(question => {
              return (
                <div key={question.id}>
                  <h3>{question.questionText}</h3>
                  <textarea />
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
    padding: 0 24px;
    overflow: auto;
  `
};
