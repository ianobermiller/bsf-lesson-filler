import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {fetchLesson, fetchVerseHTML, Lesson, Study} from './API';
import {LessonEditorDay} from './LessonEditorDay';

export const SelectedVerseContext = React.createContext<(html: string) => void>(
  () => {},
);

export function LessonEditor({
  lessonID,
  studies,
}: {
  lessonID: string;
  studies: Study[];
}): JSX.Element {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<string>('');
  const [verseHTML, setVerseHTML] = useState<string>('');

  useEffect(() => {
    const controller = new AbortController();
    fetchLesson(lessonID, controller.signal).then(setLesson);
    return () => {
      controller.abort();
    };
  }, [lessonID]);

  useEffect(() => {
    if (selectedVerse) {
      const controller = new AbortController();
      fetchVerseHTML(selectedVerse, controller.signal).then(setVerseHTML);
      return () => {
        controller.abort();
      };
    }
  }, [selectedVerse]);

  if (!lesson) {
    return <div className={styles.lessonEditor} />;
  }

  const verses = studies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
    ?.verses;

  return (
    <SelectedVerseContext.Provider value={setSelectedVerse}>
      <div className={styles.lessonEditor}>
        <div className={styles.lesson}>
          <h1 className={styles.title}>
            {verses} - Lesson {lesson.number}
          </h1>
          {lesson.days.map((day, index) => (
            <LessonEditorDay day={day} key={index} />
          ))}
        </div>
        <div
          className={styles.verse}
          dangerouslySetInnerHTML={{__html: verseHTML}}
        />
      </div>
    </SelectedVerseContext.Provider>
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
  verse: css`
    flex: 1 1 0;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;

    > h2 {
      font-size: var(--font-size-xl);
    }

    small {
      font-size: var(--font-size-s);
      font-weight: normal;
    }

    sup,
    .verse-num {
      font-size: var(--font-size-xs);
      position: relative;
      top: -6px;
      vertical-align: baseline;
    }

    a {
      color: var(--content-interactive);
    }

    p {
      line-height: 1.5;
    }
  `,
};
