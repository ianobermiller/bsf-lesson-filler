import React, { useState, useEffect, useRef } from "react";
import { Study, LessonEntry } from "./API";

export function LessonList({
  isExpandedInitially,
  onSelectLesson,
  selectedLessonID,
  study
}: {
  isExpandedInitially: boolean;
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  study: Study;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(isExpandedInitially);
  return (
    <div key={study.title}>
      <h1 className="StudyName" onClick={() => setIsExpanded(v => !v)}>
        {study.title} ({study.startYear} - {study.endYear})
      </h1>
      {isExpanded && (
        <ul className="LessonList">
          {study.lessons.map(lesson => {
            const isSelected = selectedLessonID === lesson.id;
            return (
              <LessonItem
                isSelected={isSelected}
                lesson={lesson}
                onSelectLesson={onSelectLesson}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

function LessonItem({
  isSelected,
  lesson,
  onSelectLesson
}: {
  isSelected: boolean;
  lesson: LessonEntry;
  onSelectLesson: (lessonID: string) => void;
}): JSX.Element {
  const ref = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (isSelected) {
      ref.current && (ref.current as any).scrollIntoViewIfNeeded();
    }
  }, [isSelected]);
  return (
    <li
      className={`LessonList-Item ${
        isSelected ? "LessonList-Item_Selected" : ""
      }`}
      key={lesson.id}
      onClick={() => onSelectLesson(lesson.id)}
      ref={ref}
    >
      <h2 className="LessonList-Item-Name">
        {lesson.verses} - Lesson {lesson.number}
      </h2>
      <div className="LessonList-Item-Date">
        {lesson.date.toLocaleDateString()}
      </div>
    </li>
  );
}
