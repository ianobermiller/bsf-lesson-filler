import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchAnswersByQuestionID} from './api/AnswersAPI';
import {fetchStudies, Study} from './api/StudiesAPI';
import './Colors';
import {LessonEditor} from './editor/LessonEditor';
import {useCurrentUser} from './hooks/useCurrentUser';
import {FirebaseLogin} from './login/FirebaseLogin';
import {StudyList} from './nav/StudyList';

function App() {
  const [studies, setStudies] = useState<Study[] | null>(null);
  const [selectedLessonID, setSelectedLessonID] = useState<string | null>(null);
  useEffect(() => {
    fetchStudies().then(studies => {
      setStudies(studies);
      setSelectedLessonID(
        studies
          .flatMap(s => s.lessons)
          .find(lesson => lesson.date.getTime() > Date.now())?.id ?? null,
      );
    });
  }, []);

  const answersByQuestionID = useFetchAnswersByQuestionID();

  if (!studies) {
    return null;
  }

  return (
    <div className={styles.app}>
      <StudyList
        onSelectLesson={setSelectedLessonID}
        selectedLessonID={selectedLessonID}
        studies={studies}
      />
      {selectedLessonID && (
        <LessonEditor
          answersByQuestionID={answersByQuestionID}
          lessonID={selectedLessonID}
          studies={studies}
        />
      )}
      <FirebaseLogin />
    </div>
  );
}

function useFetchAnswersByQuestionID(): Map<string, string> {
  const currentUser = useCurrentUser();
  const [answersByQuestionID, setAnswersByQuestionID] = useState<
    Map<string, string>
  >(new Map());
  useEffect(() => {
    if (currentUser) {
      fetchAnswersByQuestionID(currentUser.uid).then(setAnswersByQuestionID);
    }
  }, [currentUser]);
  return answersByQuestionID;
}

const styles = {
  app: css`
    background: var(--background-primary);
    color: var(--content-primary);
    font-family: system-ui;
    font-size: var(--font-size-m);
    display: flex;
    overflow: hidden;
    height: 100vh;
  `,
};

export default App;
