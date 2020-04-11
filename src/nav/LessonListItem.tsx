import {css, cx} from 'emotion';
import React, {useEffect, useRef} from 'react';
import {LessonEntry} from '../api/StudiesAPI';

export function LessonListItem({
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
      <div className={styles.lessonListItemName}>
        {lesson.verses} - Lesson {lesson.number}
      </div>
      <div className={styles.lessonListItemDate}>
        {lesson.date.toLocaleDateString()}
      </div>
    </li>
  );
}

const styles = {
  lessonListItem: css`
    cursor: pointer;
    font-size: var(--font-size-l);
    padding: 12px 24px;

    &:hover {
      background: var(--control-background-hover);
    }
  `,
  lessonListItemSelected: css`
    background: var(--control-background-selected);

    &:hover {
      background: var(--control-background-selected);
    }
  `,
  lessonListItemName: css`
    font-weight: bold;
    margin: 0 0 4px 0;
  `,
  lessonListItemDate: css`
    color: var(--content-secondary);
    font-size: var(--font-size-m);
  `,
};
