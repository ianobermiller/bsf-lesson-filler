import {css} from 'emotion';
import React, {useCallback, useState} from 'react';
import {fetchESVPassageHTML, fetchNLTPassageHTML} from '../api/PassageAPI';
import Button from '../components/Button';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';

export function PassageViewer({
  selectedPassage,
}: {
  selectedPassage: string;
}): JSX.Element {
  const [bible, setBible] = useState<'esv' | 'nlt'>('esv');

  const {isLoading, result: passageHTML} = useAbortableFetch({
    doFetch: useCallback(
      signal =>
        bible === 'esv'
          ? fetchESVPassageHTML(selectedPassage, signal)
          : fetchNLTPassageHTML(selectedPassage, signal),
      [bible, selectedPassage],
    ),
    defaultValue: '',
    shouldFetch: Boolean(selectedPassage),
  });

  let content;
  if (isLoading) {
    content = <FullSizeLoadingIndicator />;
  } else if (passageHTML) {
    content = (
      <div
        dangerouslySetInnerHTML={
          passageHTML ? {__html: passageHTML} : undefined
        }
        className={bible === 'esv' ? styles.esv : styles.nlt}
      />
    );
  }

  return (
    <div className={styles.passageViewer}>
      <Button
        className={styles.switchBibles}
        onClick={() => {
          setBible(prevBible => (prevBible === 'esv' ? 'nlt' : 'esv'));
        }}>
        Switch to {bible === 'esv' ? 'NLT' : 'ESV'}
      </Button>
      {content}
    </div>
  );
}

const styles = {
  passageViewer: css`
    flex: 1 1 0;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;
    position: relative;
  `,
  switchBibles: css`
    position: absolute;
    right: var(--s);
    top: var(--s);
  `,
  esv: css`
    line-height: 1.2;

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
      font-weight: bold;
      vertical-align: baseline;
      position: relative;
      top: -4px;
    }

    a {
      color: var(--content-interactive);
    }
  `,
  nlt: css`
    line-height: 1.2;

    h2 {
      font-size: var(--font-size-xl);
    }

    p {
      margin: 0;

      &.body {
        text-indent: 1em;
      }
    }

    .chapter-number {
      float: left;
      font-size: var(--xl);
      font-weight: normal;
      padding-right: 0.5ex;
      vertical-align: top;

      .cw {
        display: none;
      }
    }

    .subhead {
      font-style: italic;
      font-weight: bold;
      margin-top: 1em;
    }

    .vn {
      font-size: var(--font-size-xs);
      font-weight: bold;
      padding-right: var(--xs);
      vertical-align: text-top;
    }

    .tn {
      background-color: var(--background-secondary);
      clear: right;
      float: right;
      font-size: 90%;
      margin-bottom: 3pt;
      margin-left: 6pt;
      margin-top: 3pt;
      padding: var(--xs) var(--s);
      text-indent: 0em;
      width: 10em;
    }
  `,
};
