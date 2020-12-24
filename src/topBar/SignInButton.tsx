import {css} from 'emotion';
import React, {useContext, useState} from 'react';
import Button from '../components/Button';
import {UserContext} from '../hooks/useCurrentUser';

type Props = {
  className: string;
};

export default function SignInButton(props: Props): JSX.Element | null {
  const [isShowingModal, setIsShowingModal] = useState(false);
  const {currentUser, signOut} = useContext(UserContext);

  let text;
  if (!currentUser) {
    text = 'Sign In';
  } else {
    text = 'Sign Out';
  }

  return (
    <>
      {currentUser?.email && (
        <div className={styles.email}>{currentUser?.email}</div>
      )}
      <Button
        className={props.className}
        onClick={() => {
          if (currentUser) {
            signOut();
          } else {
            setIsShowingModal(true);
          }
        }}>
        {text}
      </Button>
      {!currentUser && isShowingModal && <SignInModal />}
    </>
  );
}

function SignInModal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {isLoadingUser, loginError, startSignIn} = useContext(UserContext);
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
          onClick={() => startSignIn({email, password})}>
          Sign In
        </Button>
      </div>
    </>
  );
}

const styles = {
  email: css`
    padding: var(--s) var(--m);
  `,
  modalBackground: css`
    background: #000a;
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  `,
  modalRoot: css`
    background: var(--background-empty);
    padding: var(--m);
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

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
  `,
  loginError: css`
    color: var(--content-negative);
    margin: var(--m) 0;
  `,
};
