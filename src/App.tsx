import React, { useEffect, useState } from "react";
import "./App.scss";
import { Study, fetchStudies } from "./API";
import { StudyList } from "./StudyList";
import { LessonEditor } from "./LessonEditor";

function App() {
  const [studies, setStudies] = useState<Study[] | null>(null);
  const [selectedLessonID, setSelectedLessonID] = useState<string | null>(null);
  useEffect(() => {
    fetchStudies().then(studies => {
      setStudies(studies);
      setSelectedLessonID(
        studies
          .flatMap(s => s.lessons)
          .find(lesson => lesson.date.getTime() > Date.now())?.id ?? null
      );
    });
  }, []);

  if (!studies) {
    return null;
  }

  return (
    <div className="App">
      <StudyList
        onSelectLesson={setSelectedLessonID}
        selectedLessonID={selectedLessonID}
        studies={studies}
      />
      {selectedLessonID && <LessonEditor lessonID={selectedLessonID} />}
    </div>
  );
}

export default App;
