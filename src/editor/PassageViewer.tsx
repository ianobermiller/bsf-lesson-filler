import {css, cx} from 'emotion';
import React, {useCallback} from 'react';
import {fetchNLTPassageHTML} from '../api/PassageAPI';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';

export function PassageViewer({
  selectedPassage,
}: {
  selectedPassage: string;
}): JSX.Element {
  const {isLoading, result: passageHTML} = useAbortableFetch({
    doFetch: useCallback(
      signal => fetchNLTPassageHTML(selectedPassage, signal),
      [selectedPassage],
    ),
    defaultValue: '',
    shouldFetch: Boolean(selectedPassage),
  });

  if (isLoading) {
    return (
      <div className={styles.passageViewer}>
        <FullSizeLoadingIndicator />
      </div>
    );
  }

  return (
    <div
      className={cx(styles.passageViewer, styles.nlt)}
      dangerouslySetInnerHTML={passageHTML ? {__html: passageHTML} : undefined}
    />
  );
}

const styles = {
  passageViewer: css`
    flex: 1 1 0;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;
    position: relative;
  `,
  esv: css`
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
      margin-right: var(--xs);
      position: relative;
      top: -6px;
      vertical-align: baseline;
    }

    a {
      color: var(--content-interactive);
    }

    p {
      line-height: 1.5;
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
      vertical-align: text-top;
      font-size: 75%;
      font-weight: bold;
      padding-right: 0.2em;
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
