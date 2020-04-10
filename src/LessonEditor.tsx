import {css} from 'emotion';
import React, {useEffect, useRef, useState} from 'react';
import {
  fetchLesson,
  fetchVerseHTML,
  Lesson,
  LessonDay,
  Question,
  scanForVerses,
  Study,
  VerseScan,
} from './API';

export function LessonEditor({
  lessonID,
  studies,
}: {
  lessonID: string;
  studies: Study[];
}): JSX.Element {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetchLesson(lessonID, controller.signal).then(setLesson);
    return () => {
      controller.abort();
    };
  }, [lessonID]);

  if (!lesson) {
    return <div className={styles.lessonEditor} />;
  }

  const verses = studies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
    ?.verses;

  return (
    <div className={styles.lessonEditor}>
      <h1 className={styles.title}>
        {verses} - Lesson {lesson.number}
      </h1>
      {lesson.days.map((day, index) => (
        <LessonEditorDay day={day} key={index} />
      ))}
    </div>
  );
}

function LessonEditorDay({day}: {day: LessonDay}) {
  return (
    <div>
      <h2 className={styles.dayHeading}>{day.title}</h2>
      <i>{day.note}</i>
      {day.questions.map(question => (
        <LessonEditorQuestion key={question.id} question={question} />
      ))}
    </div>
  );
}

function LessonEditorQuestion({question}: {question: Question}) {
  const verseRef = useRef<HTMLDivElement>(null);
  return (
    <div key={question.id}>
      <h3 className={styles.question}>
        <TextWithBibleVerses text={question.questionText} verseRef={verseRef} />
      </h3>
      <div ref={verseRef}></div>
      <textarea className={styles.textarea} />
    </div>
  );
}

function TextWithBibleVerses({
  text,
  verseRef,
}: {
  text: string;
  verseRef: React.RefObject<HTMLElement>;
}): JSX.Element {
  const [verses, setVerses] = useState<VerseScan[]>();
  useEffect(() => {
    scanForVerses(text).then(setVerses);
  }, [text]);

  if (!verses?.length) {
    return <>{text}</>;
  }

  const parts: (JSX.Element | string)[] = [];
  let index = 0;
  for (const verse of verses) {
    if (index < verse.textIndex) {
      parts.push(text.slice(index, verse.textIndex));
    }
    const endIndex = verse.textIndex + verse.textLength;
    parts.push(
      <abbr
        key={verse.textIndex}
        onClick={async () => {
          const html = await fetchVerseHTML(verse.passage);
          if (verseRef.current) {
            verseRef.current.innerHTML = html;
          }
        }}
        title={verse.passage}>
        {text.slice(verse.textIndex, endIndex)}
      </abbr>,
    );
    index = endIndex;
  }
  if (index < text.length) {
    parts.push(text.slice(index));
  }

  return <>{parts}</>;
}

const styles = {
  lessonEditor: css`
    flex: 1 1 auto;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;
  `,
  title: css`
    font-size: var(--font-size-xl);
  `,
  dayHeading: css`
    font-size: var(--font-size-l);
  `,
  question: css`
    font-size: var(--font-size-m);
    font-weight: normal;
  `,
  textarea: css`
    background: var(--control-background);
    border-radius: var(--radius-s);
    border: none;
    color: var(--content-primary);
    font-family: system-ui;
    font-size: var(--font-size-m);
    height: 100px;
    padding: var(--s);
    width: 400px;
  `,
};
