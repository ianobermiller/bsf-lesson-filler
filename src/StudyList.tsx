import {css} from 'emotion';
import React from 'react';
import {LessonList} from './LessonList';
import {Study} from './StudiesAPI';

export function StudyList({
  onSelectLesson,
  selectedLessonID,
  studies,
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
    flex-shrink: 0;
    overflow: auto;
    width: 300px;
  `,
};
