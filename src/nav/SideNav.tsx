import {css, cx} from 'emotion';
import React, {Fragment, useContext, useEffect, useRef} from 'react';
import {RiCloseLine} from 'react-icons/ri';
import {Study} from '../api/StudiesAPI';
import Button from '../components/Button';
import {UserContext} from '../hooks/useCurrentUser';
import {useOnClickOutside} from '../hooks/useOnClickOutside';
import ZIndex from '../styles/ZIndex';
import SignInButton from './SignInButton';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  studies: Study[];
}

export function SideNav({
  isVisible,
  onClose,
  onSelectLesson,
  selectedLessonID,
  studies,
}: Props): JSX.Element {
  const ref = useRef(null);
  const selectedLessonRef = useRef<HTMLButtonElement | null>(null);
  const {currentUser} = useContext(UserContext);
  useEffect(() => {
    selectedLessonRef.current?.scrollIntoView({block: 'center'});
  }, [selectedLessonID]);
  useOnClickOutside(ref, onClose);
  return (
    <nav className={cx(styles.root, isVisible && styles.isVisible)} ref={ref}>
      <Button className={styles.close} onClick={onClose} use="flat">
        <RiCloseLine size={20} />
      </Button>
      <h3 className={styles.header}>Lessons</h3>
      <ul className={styles.navItems}>
        {studies.map(study => (
          <Fragment key={study.title}>
            {study.lessons.map(lesson => (
              <li key={lesson.id}>
                <Button
                  className={styles.navItem}
                  isSelected={lesson.id === selectedLessonID}
                  onClick={() => onSelectLesson(lesson.id)}
                  ref={
                    lesson.id === selectedLessonID ? selectedLessonRef : null
                  }
                  use="flat">
                  <div className={styles.lessonName}>
                    {lesson.verses} - Lesson {lesson.number}
                  </div>
                  <div>
                    {lesson.date.getTime() !== 0
                      ? lesson.date.toLocaleDateString()
                      : ''}
                  </div>
                </Button>
              </li>
            ))}
          </Fragment>
        ))}
        {window.location.search.includes('?export') && (
          <>
            <li>
              <Button className={styles.navItem} onClick={() => {}}>
                Export Data
              </Button>
            </li>
            <li>
              <Button
                className={styles.navItem}
                disabled={true}
                onClick={() => {}}>
                Import Data
              </Button>
            </li>
          </>
        )}
      </ul>
      <div className={styles.bottom}>
        {currentUser?.email && (
          <div className={styles.email}>{currentUser?.email}</div>
        )}
        <SignInButton className={styles.signIn} />
      </div>
    </nav>
  );
}

const styles = {
  root: css`
    background: var(--background-secondary);
    bottom: 0;
    display: flex;
    flex-direction: column;
    left: 0;
    position: fixed;
    top: 0;
    transform: translateX(-300px);
    transition: transform 100ms ease-in-out;
    width: 300px;
    z-index: ${ZIndex.SideNav};
  `,
  isVisible: css`
    box-shadow: 0 0 24px #111;
    transform: translateX(0);
  `,
  header: css`
    margin: var(--s) var(--m);
  `,
  close: css`
    position: absolute;
    top: 0;
    right: 0;
  `,
  bottom: css`
    padding: var(--l) var(--m) var(--m) var(--m);
  `,
  navItems: css`
    display: flex;
    flex-direction: column;
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: scroll;
    flex-grow: 1;
  `,
  navItem: css`
    border-radius: 0;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
  `,
  lessonName: css`
    font-weight: bold;
    margin-bottom: var(--xs);
  `,
  email: css`
    margin-bottom: var(--s);
  `,
  signIn: css`
    width: 100%;
  `,
};
