import {css} from 'emotion';
import React, {useEffect, useState} from 'react';
import {ReferenceResult, scanForReferences} from '../api/ReferencesAPI';

/**
 * Highlights Bible references in the given text, returning chunks of text
 * interspersed with inline tags, all with no wrapper.
 **/
export default function TextWithBibleReferences({
  text,
  onPassageClicked,
}: {
  text: string;
  onPassageClicked: (verse: string) => void;
}): JSX.Element {
  const [references, setReferences] = useState<ReferenceResult[]>();
  useEffect(() => {
    scanForReferences(text).then(setReferences);
  }, [text]);

  if (!references?.length) {
    return <>{text}</>;
  }

  const parts: (JSX.Element | string)[] = [];
  let index = 0;
  for (const verse of references) {
    if (index < verse.textIndex) {
      parts.push(text.slice(index, verse.textIndex));
    }
    const endIndex = verse.textIndex + verse.textLength;
    parts.push(
      <abbr
        className={styles.verse}
        key={verse.textIndex}
        onClick={() => {
          onPassageClicked(verse.passage);
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
  verse: css`
    cursor: pointer;
  `,
};