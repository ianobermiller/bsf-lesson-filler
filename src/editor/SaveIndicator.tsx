import {css} from 'emotion';
import React from 'react';
import {SaveState} from './useSaveAnswer';

interface Props {
  saveState: SaveState;
}

export function SaveIndicator({saveState}: Props): JSX.Element {
  return <div className={styles.saveState}>{saveState.type}</div>;
}

const styles = {
  saveState: css`
    position: absolute;
    right: 0;
  `,
};
