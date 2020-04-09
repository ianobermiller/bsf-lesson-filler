import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchStudies, Study} from './API';
import './Colors';
import {LessonEditor} from './LessonEditor';
import {StudyList} from './StudyList';

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
      {selectedLessonID && <LessonEditor lessonID={selectedLessonID} />}
    </div>
  );
}

const styles = {
  app: css`
    background: var(--background-empty);
    color: var(--content-primary);
    font-family: system-ui;
    display: flex;
    overflow: hidden;
    height: 100vh;
  `,
};

export default App;
