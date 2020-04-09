import {css, cx} from 'emotion';
import React, {useEffect, useRef} from 'react';
import {LessonEntry} from './API';

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
  lessonListItem: css`
    cursor: pointer;
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
    margin: 0 0 4px 0;
  `,
  lessonListItemDate: css``,
};
