import {css} from 'emotion';
import React from 'react';
import {EpubView} from 'react-reader';

export default function NotesReader({lessonID}: {lessonID: string}) {
  return (
    <div
      className={css`
        flex: 1 1 0;
        overflow: scroll;
        position: relative;
      `}>
      <EpubView
        epubOptions={{
          manager: 'continuous',
          flow: 'scrolled',
          stylesheet: `${process.env.PUBLIC_URL}/notes.css`,
        }}
        url={`${process.env.PUBLIC_URL}/notes/${lessonID}.epub`}
      />
    </div>
  );
}
