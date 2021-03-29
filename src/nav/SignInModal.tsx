import {css} from 'emotion';
import React, {useContext, useEffect, useRef, useState} from 'react';
import Button from '../components/Button';
import {UserContext} from '../hooks/useCurrentUser';
import {Modal} from './Modal';

interface Props {
  onClose: () => void;
}

export function SignInModal({onClose}: Props): JSX.Element | null {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isLoadingUser, loginError, startSignIn, startSignUp} = useContext(
    UserContext,
  );

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const canSignInOrUp = !isLoadingUser && email && password;

  return (
    <Modal onClose={onClose}>
      <form
        className={styles.modalRoot}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          onChange={e => setEmail(e.currentTarget.value)}
          ref={emailRef}
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
          disabled={!canSignInOrUp}
          onClick={() => startSignIn({email, password})}
          type="submit">
          Sign In
        </Button>
        <Button
          disabled={!canSignInOrUp}
          onClick={() => startSignUp({email, password})}>
          Sign Up
        </Button>
      </form>
    </Modal>
  );
}

const styles = {
  modalRoot: css`
    display: flex;
    flex-direction: column;
    width: 400px;

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
