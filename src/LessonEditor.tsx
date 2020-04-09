import React, { useState, useEffect } from "react";
import { Lesson, fetchLesson } from "./API";

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
    return <div className="LessonEditor" />;
  }

  return (
    <div className="LessonEditor">
      <h1>Lesson {lesson.id}</h1>
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
