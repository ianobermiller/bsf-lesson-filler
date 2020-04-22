import {css, cx} from 'emotion';
import React from 'react';

export default function Button({
  className,
  isSelected,
  ...otherProps
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {isSelected?: boolean}): JSX.Element {
  return (
    <button
      {...otherProps}
      className={cx(
        styles.root,
        otherProps.disabled && styles.disabled,
        isSelected && styles.selected,
        className,
      )}
    />
  );
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
  disabled: css`
    background: var(--control-background-disabled);
    color: var(--content-disabled);
    cursor: auto;
  `,
  selected: css`
    background: var(--control-background-selected);
  `,
};
