import {css, cx} from 'emotion';
import React, {useEffect, useRef, useState} from 'react';
import {LessonEntry, Study} from './API';

export function LessonList({
  isExpandedInitially,
  onSelectLesson,
  selectedLessonID,
  study,
}: {
  isExpandedInitially: boolean;
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  study: Study;
}): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(isExpandedInitially);
  return (
    <div key={study.title}>
      <h1 className={styles.studyName} onClick={() => setIsExpanded(v => !v)}>
        {study.title} ({study.startYear} - {study.endYear})
      </h1>
      {isExpanded && (
        <ul className={styles.lessonList}>
          {study.lessons.map(lesson => {
            const isSelected = selectedLessonID === lesson.id;
            return (
              <LessonItem
                key={lesson.id}
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
  onSelectLesson,
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
      className={cx(
        styles.lessonListItem,
        isSelected && styles.lessonListItemSelected,
      )}
      onClick={() => onSelectLesson(lesson.id)}
      ref={ref}>
      <h2 className={styles.lessonListItemName}>
        {lesson.verses} - Lesson {lesson.number}
      </h2>
      <div className={styles.lessonListItemDate}>
        {lesson.date.toLocaleDateString()}
      </div>
    </li>
  );
}

const styles = {
  studyName: css`
    background: #111;
    cursor: pointer;
    left: 0;
    padding: 0 24px;
    position: sticky;
    top: 0;
  `,
  lessonList: css`
    list-style-type: none;
    padding: 0;
  `,
  lessonListItem: css`
    cursor: pointer;
    padding: 12px 24px;

    &:hover {
      background: #222;
    }
  `,
  lessonListItemSelected: css`
    background: #222;
  `,
  lessonListItemName: css`
    margin: 0 0 4px 0;
  `,
  lessonListItemDate: css``,
};
