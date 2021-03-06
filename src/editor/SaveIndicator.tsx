import {css, cx} from 'emotion';
import React, {useEffect, useState} from 'react';
import {RiAlertLine, RiCheckFill, RiRepeat2Line} from 'react-icons/ri';
import {SaveState} from './useSaveAnswer';

const SHOW_SAVED_INDICATOR_MS = 2000;

interface Props {
  saveState: SaveState;
}

export function SaveIndicator({saveState}: Props): JSX.Element | null {
  const [isSavedVisible, setIsSavedVisible] = useState(false);

  useEffect(() => {
    if (saveState.type === 'saved') {
      setIsSavedVisible(true);
      const id = setTimeout(
        () => setIsSavedVisible(false),
        SHOW_SAVED_INDICATOR_MS,
      );
      return () => clearTimeout(id);
    } else {
      setIsSavedVisible(false);
    }
  }, [saveState]);

  let icon = null;
  let title;
  switch (saveState.type) {
    case 'none':
      break;
    case 'saving':
      icon = <RiRepeat2Line />;
      title = 'Saving';
      break;
    case 'saved':
      if (isSavedVisible) {
        icon = <RiCheckFill />;
        title = 'Saved';
      }
      break;
    case 'error':
      icon = <RiAlertLine />;
      title = 'Error Saving: ' + saveState.error.message;
      break;
  }

  return (
    <div className={cx(styles.saveState, icon && styles.visible)} title={title}>
      {icon}
    </div>
  );
}

const styles = {
  saveState: css`
    margin-top: -20px;
    opacity: 0;
    position: absolute;
    right: 0;
    transition: opacity 200ms ease-in-out;
  `,
  visible: css`
    opacity: 1;
  `,
};
