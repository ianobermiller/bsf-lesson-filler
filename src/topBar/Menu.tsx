import {css, cx} from 'emotion';
import React, {useRef, useState} from 'react';
import {TiThMenu} from 'react-icons/ti';
import Button from '../components/Button';
import {useOnClickOutside} from '../hooks/useOnClickOutside';
import SignInButton from './SignInButton';

export default function Menu(): JSX.Element {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  useOnClickOutside(rootRef, () => setIsMenuVisible(false));
  return (
    <div className={styles.root} ref={rootRef}>
      <Button onClick={() => setIsMenuVisible(v => !v)}>
        <TiThMenu />
      </Button>
      <ul className={cx(styles.menu, isMenuVisible && styles.menuVisible)}>
        <li>
          <SignInButton className={styles.button} />
        </li>
        <li>
          <Button className={styles.button}>Export Data</Button>
        </li>
        <li>
          <Button className={styles.button}>Import Data</Button>
        </li>
      </ul>
    </div>
  );
}

const styles = {
  root: css`
    position: relative;
  `,
  menu: css`
    background: var(--background-primary);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    display: none;
    margin: 0;
    max-width: 100vw;
    padding: 0;
    position: absolute;
    right: 0;
    top: 100%;
    width: 200px;
    z-index: 1;

    > li {
      list-style-type: none;
    }
  `,
  button: css`
    border-radius: 0;
    text-align: left;
    width: 100%;
  `,
  menuVisible: css`
    display: block;
  `,
};
