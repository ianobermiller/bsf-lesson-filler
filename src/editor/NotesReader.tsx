import React from 'react';
import {EpubView} from 'react-reader';
import {ReferencePane} from './ReferencePane';

interface Props {
  lessonID: string;
  onClose: () => void;
}

export default function NotesReader({lessonID, onClose}: Props) {
  return (
    <ReferencePane onClose={onClose} isVisible={true}>
      <EpubView
        epubOptions={{
          manager: 'continuous',
          flow: 'scrolled',
          stylesheet: `${process.env.PUBLIC_URL}/notes.css`,
        }}
        url={`${process.env.PUBLIC_URL}/notes/${lessonID}.epub`}
      />
    </ReferencePane>
  );
}
