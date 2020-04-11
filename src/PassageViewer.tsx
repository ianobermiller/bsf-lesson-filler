import {css} from 'emotion';
import React, {useCallback} from 'react';
import {fetchESVPassageHTML} from './API';
import {useAbortableFetch} from './useAbortableFetch';

export function PassageViewer({
  selectedPassage,
}: {
  selectedPassage: string;
}): JSX.Element {
  const passageHTML = useAbortableFetch({
    doFetch: useCallback(
      signal => fetchESVPassageHTML(selectedPassage, signal),
      [selectedPassage],
    ),
    defaultValue: '',
    shouldFetch: Boolean(selectedPassage),
  });

  return (
    <div
      className={styles.passageViewer}
      dangerouslySetInnerHTML={{__html: passageHTML}}
    />
  );
}

const styles = {
  passageViewer: css`
    flex: 1 1 0;
    padding: 0 var(--l) var(--l) var(--l);
    overflow: auto;

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
};
