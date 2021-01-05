import {css} from 'emotion';
import React, {useContext, useState} from 'react';
import Button from '../components/Button';
import {UserContext} from '../hooks/useCurrentUser';

export function SignInModal(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isLoadingUser, loginError, startSignIn, startSignUp} = useContext(
    UserContext,
  );
  return (
    <>
      <div className={styles.modalBackground} />
      <div className={styles.modalRoot}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          onChange={e => setEmail(e.currentTarget.value)}
          type="email"
          value={email}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          onChange={e => setPassword(e.currentTarget.value)}
          type="password"
          value={password}
        />
        {loginError && <div className={styles.loginError}>{loginError}</div>}
        <Button
          disabled={isLoadingUser || !email || !password}
          onClick={() => {
            startSignIn({email, password});
          }}>
          Sign In
        </Button>
        <Button
          disabled={isLoadingUser || !email || !password}
          onClick={() => {
            startSignUp({email, password});
          }}>
          Sign Up
        </Button>
      </div>
    </>
  );
}

const styles = {
  modalBackground: css`
    background: #000a;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;
  `,
  modalRoot: css`
    background: var(--background-empty);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: var(--m);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-width: 100vw;
    z-index: 1;

    & > label {
      display: block;
      margin-bottom: var(--xs);
    }

    & > input {
      background: var(--control-background);
      border: none;
      color: var(--content-primary);
      display: block;
      font-family: system-ui;
      font-size: var(--font-size-m);
      line-height: 32px;
      margin-bottom: var(--m);
      padding: 0 var(--s);
    }

    & > button:not(:last-of-type) {
      margin-bottom: var(--m);
      margin-top: var(--s);
    }
  `,
  loginError: css`
    color: var(--content-negative);
    margin-bottom: var(--m);
  `,
};
