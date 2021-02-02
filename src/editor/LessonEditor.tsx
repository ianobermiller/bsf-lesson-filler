import {css} from 'emotion';
import React, {Suspense, useCallback, useState} from 'react';
// import {PassageViewer} from './PassageViewer';
import {fetchLesson} from '../api/LessonAPI';
import {Study} from '../api/StudiesAPI';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';
import useIsBigScreen from '../hooks/useIsBigScreen';
import {Footer} from './Footer';
import {LessonEditorDay} from './LessonEditorDay';
import {PassageViewer} from './PassageViewer';

const NotesReader = React.lazy(() => import('./NotesReader'));

export const SelectedPassageContext = React.createContext<
  (html: string | null) => void
>(() => {});

type Props = {
  answersByQuestionID: Map<string, string> | null;
  lessonID: string;
  studies: Study[];
};

export function LessonEditor({
  answersByQuestionID,
  lessonID,
  studies,
}: Props): JSX.Element {
  const isBig = useIsBigScreen();
  const [selectedPassage, setSelectedPassage] = useState<string | null>(null);
  const {isLoading, result: lesson} = useAbortableFetch({
    doFetch: useCallback(signal => fetchLesson(lessonID, signal), [lessonID]),
    defaultValue: null,
    shouldFetch: Boolean(lessonID),
  });

  if (isLoading || !lesson) {
    return (
      <div className={styles.lessonEditor}>
        <FullSizeLoadingIndicator />
      </div>
    );
  }

  const verses = studies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
    ?.verses;
  const viewingPassage = isBig ? selectedPassage ?? verses : selectedPassage;

  return (
    <SelectedPassageContext.Provider value={setSelectedPassage}>
      <div className={styles.lessonEditor}>
        <div className={styles.lesson}>
          <h1 className={styles.title}>
            {verses && (
              <>
                <span
                  className={styles.verses}
                  onClick={() => verses && setSelectedPassage(verses)}>
                  {verses}
                </span>
                {' - '}
              </>
            )}
            Lesson {lesson.number}
          </h1>
          {lesson.days.map((day, index) => (
            <LessonEditorDay
              answersByQuestionID={answersByQuestionID}
              day={day}
              key={index}
            />
          ))}
          <Footer />
        </div>
        {selectedPassage === 'notes' ? (
          <Suspense fallback={null}>
            <NotesReader
              lessonID={lessonID}
              onClose={() => setSelectedPassage(null)}
            />
          </Suspense>
        ) : (
          <PassageViewer
            onClose={() => setSelectedPassage(null)}
            selectedPassage={viewingPassage ?? null}
          />
        )}
      </div>
    </SelectedPassageContext.Provider>
  );
}

const styles = {
  lessonEditor: css`
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
  `,
  title: css`
    font-size: var(--font-size-xl);
  `,
  lesson: css`
    flex: 1 1 0;
    overflow: auto;
    padding: 0 var(--l) var(--l) var(--l);
  `,
  verses: css`
    cursor: pointer;
    text-decoration: underline;
  `,
};
