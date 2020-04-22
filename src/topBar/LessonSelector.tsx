import {css} from 'emotion';
import React from 'react';
import {Study} from '../api/StudiesAPI';

type Props = {
  onSelectLesson: (lessonID: string) => void;
  selectedLessonID: string | null;
  studies: Study[];
};

export default function LessonSelector({
  onSelectLesson,
  selectedLessonID,
  studies,
}: Props) {
  return (
    <select
      className={styles.root}
      onChange={e => {
        onSelectLesson(e.currentTarget.value);
      }}
      value={selectedLessonID ?? undefined}>
      {studies.map(study => (
        <optgroup key={study.title} label={study.title}>
          {study.lessons.map(lesson => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.verses} - Lesson {lesson.number}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

// Note that this will not be updated when the color scheme changes, but we
// could fix that with a matchMedia call.
const ICON_COLOR = getComputedStyle(document.documentElement).getPropertyValue(
  '--content-primary',
);

// https://github.com/stephenhutchings/typicons.font/blob/fc8eebf13239a44b16fa925f6de774adb8eb8643/src/svg/arrow-unsorted.svg
const SVG_ARROW =
  'data:image/svg+xml;base64,' +
  btoa(`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24">
    <path
      d="M18.2 9.3L12 3 5.8 9.3c-.2.2-.3.4-.3.7s.1.5.3.7c.2.2.4.3.7.3h11c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7s-.1-.5-.3-.7zM5.8 14.7L12 21l6.2-6.3c.2-.2.3-.5.3-.7s-.1-.5-.3-.7c-.2-.2-.4-.3-.7-.3h-11c-.3 0-.5.1-.7.3-.2.2-.3.5-.3.7s.1.5.3.7z"
      fill="${ICON_COLOR}"
    />
  </svg>
`);

const styles = {
  root: css`
    appearance: none;
    background-color: var(--control-background);
    background-image: url(${SVG_ARROW});
    background-position: right var(--m) top 50%;
    background-repeat: no-repeat;
    background-size: var(--font-size-m);
    border-radius: var(--radius-s);
    border: none;
    box-sizing: border-box;
    color: var(--content-primary);
    cursor: pointer;
    display: inline-block;
    font-family: system-ui;
    font-size: var(--font-size-m);
    margin-left: var(--m);
    padding: var(--s) var(--m);
  `,
};
