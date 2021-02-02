import {css, cx} from 'emotion';
import React, {useCallback} from 'react';
import {
  fetchESVPassageHTML,
  fetchNIVPassageHTML,
  fetchNLTPassageHTML,
} from '../api/PassageAPI';
import Button from '../components/Button';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import {BIG, NOT_BIG} from '../styles/MediaQueries';
import {ReferencePane} from './ReferencePane';

export function PassageViewer({
  onClose,
  selectedPassage,
}: {
  onClose: () => void;
  selectedPassage: string | null;
}): JSX.Element {
  const [bible, setBible] = useLocalStorage<keyof typeof BIBLES>(
    'selectedBible',
    'niv',
  );

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
        className={cx(styles.content, BIBLES[bible].className)}
      />
    );
  }

  return (
    <ReferencePane
      buttons={
        <div className={styles.switchBibles}>
          {(Object.keys(BIBLES) as [keyof typeof BIBLES]).map(key => (
            <Button
              key={key}
              isSelected={bible === key}
              onClick={() => setBible(key)}>
              {key.toUpperCase()}
            </Button>
          ))}
        </div>
      }
      onClose={onClose}
      isVisible={!!selectedPassage}>
      {content}
    </ReferencePane>
  );
}

const styles = {
  content: css`
    padding: 0 var(--l) var(--l) var(--l);
  `,
  switchBibles: css`
    @media ${NOT_BIG} {
      display: flex;
      flex: 1 1 auto;

      > button {
        border-radius: 0;
        flex: 1 1 auto;
        padding-left: 0;
        padding-right: 0;
      }
    }

    @media ${BIG} {
      > :not(:first-child) {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        margin-left: 1px;
      }

      > :not(:last-child) {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      }
    }
  `,
};

const BIBLES = {
  niv: {
    fetchHTML: fetchNIVPassageHTML,
    className: css`
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
      > h2 {
        font-size: var(--font-size-xl);
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
