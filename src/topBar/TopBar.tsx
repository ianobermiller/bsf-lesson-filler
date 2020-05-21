import {css} from 'emotion';
import React from 'react';
import {Study} from '../api/StudiesAPI';
import useMediaQuery from '../hooks/useMediaQuery';
import {TABLET} from '../styles/MediaQueries';
import LessonSelector from './LessonSelector';
import SignInButton from './SignInButton';

type Props = {
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  studies: Study[];
};

export default function TopBar(props: Props) {
  const isTablet = useMediaQuery(TABLET);
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <div className={styles.title}>{isTablet ? 'BSF Lessons' : 'BSF'}</div>
        <LessonSelector {...props} />
      </div>
      <SignInButton />
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
    padding: 0 var(--s) 0 var(--l);
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
