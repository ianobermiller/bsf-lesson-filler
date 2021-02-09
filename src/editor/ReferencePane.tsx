import {css, cx} from 'emotion';
import React, {ReactElement} from 'react';
import Button from '../components/Button';
import useIsBigScreen from '../hooks/useIsBigScreen';
import useSwipeToDismiss from '../hooks/useSwipeToDismiss';
import {BIG, NOT_BIG} from '../styles/MediaQueries';

interface Props {
  buttons?: ReactElement;
  children?: ReactElement;
  onClose: () => void;
  isVisible: boolean;
}

export function ReferencePane({
  buttons,
  children,
  onClose,
  isVisible,
}: Props): JSX.Element {
  const isBig = useIsBigScreen();
  const swipeToDismissProps = useSwipeToDismiss(onClose);

  return (
    <div
      className={cx(styles.root, !isVisible && styles.hidden)}
      {...swipeToDismissProps}>
      <div className={styles.buttons}>
        {!isBig && (
          <Button className={styles.backButton} onClick={onClose}>
            {'\u25c0'}
          </Button>
        )}
        {buttons}
      </div>
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );
}

const styles = {
  root: css`
    @media ${NOT_BIG} {
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

    @media ${BIG} {
      flex: 1 1 0;
      overflow-y: scroll;
      position: relative;
    }
  `,
  hidden: css`
    transform: translateX(100%);
  `,
  contentWrapper: css`
    @media ${NOT_BIG} {
      flex: 1 1 auto;
      overflow-y: scroll;
    }
  `,
  backButton: css`
    border-radius: 0;
    margin-right: var(--m);
  `,
  buttons: css`
    display: flex;
    flex-shrink: 0;

    @media ${BIG} {
      float: right;
      margin: var(--s) var(--s) var(--l) var(--l);
    }
  `,
};
