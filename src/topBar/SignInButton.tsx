import {css} from 'emotion';
import React, {Suspense, useRef, useState} from 'react';
import Button from '../components/Button';
import {auth} from '../Firebase';
import {useCurrentUser} from '../hooks/useCurrentUser';
import useIsBigScreen from '../hooks/useIsBigScreen';
import {LoginRef} from '../login/FirebaseLogin';

const FirebaseLogin = React.lazy(() => import('../login/FirebaseLogin'));

export default function SignInButton(): JSX.Element | null {
  const isBig = useIsBigScreen();
  const loginRef = useRef<LoginRef | null>(null);
  const [isRenderingFirebaseLogin, setIsRenderingFirebaseLogin] = useState(
    auth.isSignInWithEmailLink(window.location.href),
  );
  const {currentUser} = useCurrentUser();

  let text;
  if (!currentUser) {
    text = 'Sign In';
  } else if (currentUser.isAnonymous) {
    text = 'Sign In with Email';
  } else {
    text = 'Sign Out';
  }

  const canLogin = !currentUser || currentUser.isAnonymous;

  return (
    <>
      <div className={styles.root}>
        {isBig && <div className={styles.email}>{currentUser?.email}</div>}
        <Button
          onClick={() => {
            if (canLogin) {
              if (!isRenderingFirebaseLogin) {
                setIsRenderingFirebaseLogin(true);
              } else {
                loginRef.current?.show();
              }
            } else {
              auth.signOut();
            }
          }}>
          {text}
        </Button>
      </div>

      <Suspense fallback={null}>
        {isRenderingFirebaseLogin ? <FirebaseLogin ref={loginRef} /> : null}
      </Suspense>
    </>
  );
}

const styles = {
  root: css`
    align-items: center;
    display: flex;
  `,
  email: css`
    margin-right: var(--m);
  `,
};
