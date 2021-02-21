import {css, cx} from 'emotion';
import React, {forwardRef} from 'react';

type Props = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {isSelected?: boolean; use?: 'flat'};

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {className, isSelected, use, ...otherProps}: Props,
  ref,
): JSX.Element {
  return (
    <button
      {...otherProps}
      className={cx(
        styles.root,
        isSelected && styles.selected,
        use === 'flat' && styles.flat,
        className,
      )}
      ref={ref}
    />
  );
});
export default Button;

const styles = {
  root: css`
    background: var(--control-background);
    border-radius: var(--radius-s);
    border: none;
    color: var(--content-primary);
    cursor: pointer;
    display: inline-flex;
    font-family: system-ui;
    font-size: var(--font-size-m);
    justify-content: center;
    padding: var(--s) var(--m);

    :hover {
      background: var(--control-background-hover);
    }

    :active {
      background: var(--control-background-active);
    }

    :disabled {
      background: var(--control-background-disabled);
      color: var(--content-disabled);
      cursor: auto;
    }
  `,
  selected: css`
    &,
    &:hover,
    &:active {
      background: var(--control-background-selected);
    }
  `,
  flat: css`
    background: transparent;
  `,
};
