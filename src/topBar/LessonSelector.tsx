import {css} from 'emotion';
import React from 'react';
import {RiArrowLeftLine, RiArrowRightLine} from 'react-icons/ri';
import {Study} from '../api/StudiesAPI';
import Button from '../components/Button';

type Props = {
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  studies: Study[];
};

export default function LessonSelector({
  onSelectLesson,
  selectedLessonID,
  studies,
}: Props) {
  const lessons = studies.flatMap(s => s.lessons);
  const currentIndex = lessons.findIndex(l => l.id === selectedLessonID);
  const previousLessonID = lessons[currentIndex - 1]?.id;
  const nextLessonID = lessons[currentIndex + 1]?.id;

  return (
    <div className={styles.root}>
      <Button
        aria-label="Previous lesson"
        disabled={!previousLessonID}
        onClick={() => onSelectLesson(previousLessonID)}>
        <RiArrowLeftLine />
      </Button>
      <Button
        aria-label="Next lesson"
        disabled={!nextLessonID}
        onClick={() => onSelectLesson(nextLessonID)}>
        <RiArrowRightLine />
      </Button>
    </div>
  );
}

const styles = {
  root: css`
    & > :not(:first-child) {
      margin-left: var(--s);
    }
  `,
};
