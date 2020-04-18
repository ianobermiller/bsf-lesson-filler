import {css} from 'emotion';
import React from 'react';
import SignInButton from './SignInButton';

export default function TopBar() {
  return (
    <div className={styles.root}>
      <div className={styles.title}>BSF Lesson Filler</div>
      <SignInButton />
    </div>
  );
}

const styles = {
  root: css`
    align-items: center;
    border-bottom: 1px solid var(--border-primary);
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    padding: 0 var(--s) 0 var(--l);
  `,
  title: css`
    font-size: var(--font-size-xl);
    margin: var(--m) 0;
  `,
};
