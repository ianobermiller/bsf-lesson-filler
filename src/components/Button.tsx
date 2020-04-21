import {css, cx} from 'emotion';
import React from 'react';

export default function Button({
  className,
  ...otherProps
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>): JSX.Element {
  return <button {...otherProps} className={cx(styles.root, className)} />;
}

const styles = {
  root: css`
    background: var(--control-background);
    border-radius: var(--radius-s);
    border: none;
    color: var(--content-primary);
    cursor: pointer;
    font-family: system-ui;
    font-size: var(--font-size-m);
    padding: var(--s) var(--m);
  `,
};
