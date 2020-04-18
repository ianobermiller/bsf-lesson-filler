import {css} from 'emotion';
import React from 'react';

export default function TopBar() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>BSF Lesson Filler</div>
    </div>
  );
}

const styles = {
  root: css`
    border-bottom: 1px solid var(--border-primary);
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
  `,
  title: css`
    font-size: var(--font-size-xl);
    margin: var(--m) var(--l);
  `,
};
