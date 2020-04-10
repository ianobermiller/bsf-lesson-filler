import {css} from 'emotion';
import React, {useRef} from 'react';
import {Question} from './API';
import TextWithBibleVerses from './TextWithBibleVerses';

export function LessonEditorQuestion({question}: {question: Question}) {
  const verseRef = useRef<HTMLDivElement>(null);
  return (
    <div key={question.id}>
      <h3 className={styles.question}>
        <TextWithBibleVerses text={question.questionText} verseRef={verseRef} />
      </h3>
      <div className={styles.verse} ref={verseRef}></div>
      <textarea className={styles.textarea} />
    </div>
  );
}

/*
"\u003Ch2 class=\"extra_text\"\u003EActs 1:8 \u003Csmall class=\"audio extra_text\"\u003E(\u003Ca class=\"mp3link\" href=\"https:\u002F\u002Faudio.esv.org\u002Fhw\u002F44001008-44001008.mp3\" title=\"Acts 1:8\" type=\"audio\u002Fmpeg\"\u003EListen\u003C\u002Fa\u003E)\u003C\u002Fsmall\u003E\u003C\u002Fh2\u003E\n\u003Cp id=\"p44001008_01-1\" class=\"virtual\"\u003E\u003Cb class=\"verse-num woc\" id=\"v44001008-1\"\u003E8&nbsp;\u003C\u002Fb\u003E\u003Cspan class=\"woc\"\u003EBut you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.”\u003C\u002Fspan\u003E\u003C\u002Fp\u003E\n\u003Cp\u003E(\u003Ca href=\"http:\u002F\u002Fwww.esv.org\" class=\"copyright\"\u003EESV\u003C\u002Fa\u003E)\u003C\u002Fp\u003E"
*/

const styles = {
  question: css`
    font-size: var(--font-size-m);
    font-weight: normal;
  `,
  verse: css`
    background: var(--background-primary);
    border-radius: var(--radius-l);
    padding: var(--m) var(--l);
    margin: 1em;
    max-width: 400px;

    > h2 {
      font-size: var(--font-size-l);
    }

    small {
      font-size: var(--font-size-s);
      font-weight: normal;
    }

    .verse-num {
      font-size: var(--font-size-xs);
      vertical-align: super;
    }
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
