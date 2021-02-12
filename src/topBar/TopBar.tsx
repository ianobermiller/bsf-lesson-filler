import {css} from 'emotion';
import React, {useContext} from 'react';
import {RiMenuLine} from 'react-icons/ri';
import {Study} from '../api/StudiesAPI';
import Button from '../components/Button';
import {UserContext} from '../hooks/useCurrentUser';
import useIsBigScreen from '../hooks/useIsBigScreen';
import LessonSelector from './LessonSelector';
import Menu from './Menu';
import SignInButton from './SignInButton';

type Props = {
  exportAnswers: () => void;
  importAnswers: () => void;
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  showSideNav: () => void;
  studies: Study[];
};

export default function TopBar(props: Props) {
  const isBig = useIsBigScreen();
  const {currentUser} = useContext(UserContext);
  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <Button onClick={props.showSideNav}>
          <RiMenuLine size={20} />
        </Button>
        <div className={styles.title}>{isBig ? 'BSF Lessons' : 'BSF'}</div>
        <LessonSelector
          onSelectLesson={props.onSelectLesson}
          selectedLessonID={props.selectedLessonID}
          studies={props.studies}
        />
      </div>
      {isBig ? (
        <div>
          {currentUser?.email && (
            <span className={styles.email}>{currentUser?.email}</span>
          )}
          <SignInButton />
        </div>
      ) : (
        <Menu
          exportAnswers={props.exportAnswers}
          importAnswers={props.importAnswers}
        />
      )}
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
  email: css`
    display: inline-block;
    margin-right: 12px;
  `,
};
