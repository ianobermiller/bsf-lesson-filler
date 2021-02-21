import {css} from 'emotion';
import React from 'react';
import {RiMenuLine} from 'react-icons/ri';
import {Study} from '../api/StudiesAPI';
import Button from '../components/Button';
import useIsBigScreen from '../hooks/useIsBigScreen';
import {NOT_BIG} from '../styles/MediaQueries';
import LessonSelector from './LessonSelector';

type Props = {
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  showSideNav: () => void;
  studies: Study[];
};

export default function TopBar(props: Props) {
  const isBig = useIsBigScreen();
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Button onClick={props.showSideNav}>
          <RiMenuLine size={20} />
        </Button>
        <div className={styles.title}>
          {isBig ? 'BSF Lesson Filler' : 'BSF'}
        </div>
        <LessonSelector
          onSelectLesson={props.onSelectLesson}
          selectedLessonID={props.selectedLessonID}
          studies={props.studies}
        />
      </div>
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
    @media ${NOT_BIG} {
      padding: 0 var(--m) 0 var(--m);
    }
  `,
  left: css`
    align-items: center;
    display: flex;
  `,
  title: css`
    font-size: var(--font-size-xl);
    margin: var(--m);
  `,
};
