import {css} from 'emotion';
import React from 'react';
import {Study} from '../api/StudiesAPI';
import useIsBigScreen from '../hooks/useIsBigScreen';
import LessonSelector from './LessonSelector';
import Menu from './Menu';

type Props = {
  exportAnswers: () => void;
  importAnswers: () => void;
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  studies: Study[];
};

export default function TopBar(props: Props) {
  const isBig = useIsBigScreen();
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.title}>{isBig ? 'BSF Lessons' : 'BSF'}</div>
        <LessonSelector
          onSelectLesson={props.onSelectLesson}
          selectedLessonID={props.selectedLessonID}
          studies={props.studies}
        />
      </div>
      <Menu
        exportAnswers={props.exportAnswers}
        importAnswers={props.importAnswers}
      />
    </div>
  );
}

const styles = {
  root: css`
    align-items: center;
    border-bottom: 1px solid var(--border-primary);
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    padding: 0 var(--m) 0 var(--l);
  `,
  left: css`
    align-items: center;
    display: flex;
  `,
  title: css`
    font-size: var(--font-size-xl);
    margin: var(--m) 0;
  `,
};
