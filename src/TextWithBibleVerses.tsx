import React, {useEffect, useState} from 'react';
import {fetchVerseHTML, scanForVerses, VerseScan} from './API';

export default function TextWithBibleVerses({
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
