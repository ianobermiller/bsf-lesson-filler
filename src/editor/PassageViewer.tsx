import {css} from 'emotion';
import React, {useCallback, useState} from 'react';
import {
  fetchESVPassageHTML,
  fetchNIVPassageHTML,
  fetchNLTPassageHTML,
} from '../api/PassageAPI';
import Button from '../components/Button';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';

export function PassageViewer({
  selectedPassage,
}: {
  selectedPassage: string;
}): JSX.Element {
  const [bible, setBible] = useState<keyof typeof BIBLES>('niv');

  const {isLoading, result: passageHTML} = useAbortableFetch({
    doFetch: useCallback(
      signal => BIBLES[bible].fetchHTML(selectedPassage, signal),
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
        className={BIBLES[bible].className}
      />
    );
  }

  return (
    <div className={styles.passageViewer}>
      <div className={styles.switchBibles}>
        {(Object.keys(BIBLES) as [keyof typeof BIBLES]).map(key => (
          <Button onClick={() => setBible(key)}>
            <span style={bible === key ? {fontWeight: 'bold'} : undefined}>
              {key.toUpperCase()}
            </span>
          </Button>
        ))}
      </div>
      {content}
    </div>
  );
}

const BIBLES = {
  niv: {
    fetchHTML: fetchNIVPassageHTML,
    className: css`
      line-height: 1.2;

      .s1 {
        font-size: var(--font-size-m);
        font-weight: bold;
      }

      .v {
        font-size: var(--font-size-xs);
        font-weight: bold;
        margin-right: var(--xs);
        position: relative;
        top: -4px;
        vertical-align: baseline;
      }

      [class^='q'] {
        text-indent: -1em;
        padding: 0 1em;
        margin: 0 1em;
      }
    `,
  },
  esv: {
    fetchHTML: fetchESVPassageHTML,
    className: css`
      line-height: 1.2;

      > h2 {
        font-size: var(--font-size-l);
      }

      > h3 {
        font-size: var(--font-size-m);
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

      .chapter-num {
        font-size: var(--l);
      }
    `,
  },
  nlt: {
    fetchHTML: fetchNLTPassageHTML,
    className: css`
      line-height: 1.2;

      h2 {
        font-size: var(--font-size-xl);
      }

      p {
        margin: 0;
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
        margin: 1em 0;
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
  },
};

const styles = {
  passageViewer: css`
    flex: 1 1 0;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;
    position: relative;
  `,
  switchBibles: css`
    float: right;
    margin: var(--s) 0 var(--l) var(--l);
    position: relative;
  `,
};
