import {css} from 'emotion';
import React from 'react';

export function FullSizeLoadingIndicator(): JSX.Element {
  return <div className={styles.root}>Loading...</div>;
}

const styles = {
  root: css`
    align-items: center;
    background: var(--control-background-disabled);
    bottom: 0;
    color: var(--content-primary);
    display: flex;
    justify-content: center;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  `,
};
