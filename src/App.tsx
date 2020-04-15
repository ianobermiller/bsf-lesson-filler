import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchStudies, Study} from './api/StudiesAPI';
import './Colors';
import {LessonEditor} from './editor/LessonEditor';
import {db} from './Firebase';
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

  // Load data from Firebase
  const currentUser = useCurrentUser();
  const [answersByQuestionID, setAnswersByQuestionID] = useState<
    Map<string, string>
  >(new Map());
  useEffect(() => {
    if (currentUser) {
      db.collection('users')
        .doc(currentUser.uid)
        .collection('answers')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            setAnswersByQuestionID(
              new Map(
                querySnapshot.docs.map(doc => {
                  const data = doc.data();
                  return [doc.id, data.answerText];
                }),
              ),
            );
          }
        });
    }
  }, [currentUser]);

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
