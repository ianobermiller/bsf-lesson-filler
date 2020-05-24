import {css, cx} from 'emotion';
import React, {useCallback, useContext} from 'react';
import {
  fetchESVPassageHTML,
  fetchNIVPassageHTML,
  fetchNLTPassageHTML,
} from '../api/PassageAPI';
import Button from '../components/Button';
import {FullSizeLoadingIndicator} from '../components/FullSizeLoadingIndicator';
import {useAbortableFetch} from '../hooks/useAbortableFetch';
import useLocalStorage from '../hooks/useLocalStorage';
import useMediaQuery from '../hooks/useMediaQuery';
import useSwipeToDismiss from '../hooks/useSwipeToDismiss';
import {NOT_TABLET, TABLET} from '../styles/MediaQueries';
import {SelectedPassageContext} from './LessonEditor';

export function PassageViewer({
  onSwipeClose,
  selectedPassage,
}: {
  onSwipeClose: () => void;
  selectedPassage: string | null;
}): JSX.Element {
  const isTabletOrLarger = useMediaQuery(TABLET);
  const setSelectedPassage = useContext(SelectedPassageContext);
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

  const props = useSwipeToDismiss(onSwipeClose);

  return (
    <div
      className={cx(
        styles.passageViewer,
        !selectedPassage && styles.passageViewerHidden,
      )}
      {...props}>
      <div className={styles.buttons}>
        {!isTabletOrLarger && (
          <Button
            className={styles.backButton}
            onClick={() => setSelectedPassage(null)}>
            {'\u25c0'}
          </Button>
        )}
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
      </div>
      {content}
    </div>
  );
}

const styles = {
  passageViewer: css`
    @media ${NOT_TABLET} {
      background: var(--background-primary);
      bottom: 0;
      display: flex;
      flex-direction: column;
      left: 0;
      position: fixed;
      right: 0;
      top: 0;
      transition: transform ease-in-out 100ms;
    }

    @media ${TABLET} {
      flex: 1 1 0;
      overflow: auto;
      position: relative;
    }
  `,
  passageViewerHidden: css`
    transform: translateX(100%);
  `,
  content: css`
    padding: 0 var(--l) var(--l) var(--l);
    @media ${NOT_TABLET} {
      flex: 1 1 auto;
      overflow: auto;
    }
  `,
  backButton: css`
    border-radius: 0;
    margin-right: var(--m);
  `,
  buttons: css`
    display: flex;
    flex-shrink: 0;

    @media ${TABLET} {
      float: right;
      margin: var(--s) var(--s) var(--l) var(--l);
    }
  `,
  switchBibles: css`
    @media ${NOT_TABLET} {
      display: flex;
      flex: 1 1 auto;

      > button {
        border-radius: 0;
        flex: 1 1 auto;
        padding-left: 0;
        padding-right: 0;
      }
    }

    @media ${TABLET} {
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
