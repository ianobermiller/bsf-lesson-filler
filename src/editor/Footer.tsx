import {css} from 'emotion';
import React from 'react';

export function Footer(): JSX.Element {
  return (
    <footer className={styles.root}>
      Created with ✝ by <a href="https://ianobermiller.com">Ian Obermiller</a>.{' '}
      Questions or comments? Email me at{' '}
      <a href="mailto:ian@obermillers.com">ian@obermillers.com</a>.
    </footer>
  );
}

const styles = {
  root: css`
    font-size: var(--font-size-xs);
    margin-top: var(--xxl);
  `,
};
