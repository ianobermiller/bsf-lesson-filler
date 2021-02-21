import {css, cx} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchAnswersByQuestionID} from './api/AnswersAPI';
import {fetchStudies, Study} from './api/StudiesAPI';
import {LessonEditor} from './editor/LessonEditor';
import {useCurrentUser, User} from './hooks/useCurrentUser';
import {SideNav} from './nav/SideNav';
import './styles/Colors';
import TopBar from './topBar/TopBar';

export default function App() {
  const [isSideNavVisible, setIsSideNavVisible] = useState(false);
  const [studies, setStudies] = useState<Study[] | null>(null);
  const [selectedLessonID, setSelectedLessonID] = useState<string | null>(null);
  useEffect(() => {
    fetchStudies().then(studies => {
      setStudies(studies);

      const nextLesson = studies[0].lessons.find(
        lesson =>
          lesson.date.getTime() === 0 || lesson.date.getTime() > Date.now(),
      );
      const selectedLesson = nextLesson ?? studies?.[0].lessons.slice(-1)[0];
      setSelectedLessonID(selectedLesson?.id ?? null);
    });
  }, []);

  const {currentUser} = useCurrentUser();
  const answersByQuestionID = useAnswersByQuestionID(currentUser);

  if (!studies) {
    return null;
  }

  return (
    <div
      className={cx(
        styles.app,
        navigator.userAgent.includes('Chrome/81') && styles.chrome81FontFix,
      )}>
      <SideNav
        isVisible={isSideNavVisible}
        onClose={() => {
          setIsSideNavVisible(false);
          document.getElementById('show-side-nav')?.focus();
        }}
        onSelectLesson={setSelectedLessonID}
        selectedLessonID={selectedLessonID}
        studies={studies}
      />
      <TopBar
        onSelectLesson={setSelectedLessonID}
        selectedLessonID={selectedLessonID}
        showSideNav={() => setIsSideNavVisible(true)}
        studies={studies}
      />
      <div className={styles.underTop}>
        {selectedLessonID && (
          <LessonEditor
            answersByQuestionID={answersByQuestionID}
            lessonID={selectedLessonID}
            studies={studies}
          />
        )}
      </div>
      <div id="modal"></div>
    </div>
  );
}

function useAnswersByQuestionID(
  currentUser: User | null,
): Map<string, string> | null {
  const [answersByQuestionID, setAnswersByQuestionID] = useState<Map<
    string,
    string
  > | null>(null);
  useEffect(() => {
    if (!currentUser) {
      setAnswersByQuestionID(null);
      return;
    }
    fetchAnswersByQuestionID(currentUser)
      .then(setAnswersByQuestionID)
      .catch(e => {
        alert(e.message);
      });
  }, [currentUser]);
  return answersByQuestionID;
}

const styles = {
  app: css`
    background: var(--background-primary);
    color: var(--content-primary);
    display: flex;
    flex-direction: column;
    font-family: system-ui;
    font-size: var(--font-size-m);
    height: 100vh;
    line-height: 1.4;
    overflow: hidden;
  `,
  chrome81FontFix: css`
    font-family: -apple-system, Helvetica;
  `,
  top: css`
    display: flex;
    flex-shrink: 0;
  `,
  underTop: css`
    display: flex;
    overflow: hidden;
    flex: 1 1 auto;
  `,
};
