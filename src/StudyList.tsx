import { css } from "emotion";
import React from "react";
import { Study } from "./API";
import { LessonList } from "./LessonList";

export function StudyList({
  onSelectLesson,
  selectedLessonID,
  studies
}: {
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  studies: Study[];
}): JSX.Element {
  return (
    <div className={styles.studyList}>
      {studies.map((study, index) => (
        <LessonList
          isExpandedInitially={index === 0}
          key={study.title}
          onSelectLesson={onSelectLesson}
          selectedLessonID={selectedLessonID}
          study={study}
        />
      ))}
    </div>
  );
}

const styles = {
  studyList: css`
    width: 400px;
    flex-shrink: 0;
    overflow: auto;
  `
};
