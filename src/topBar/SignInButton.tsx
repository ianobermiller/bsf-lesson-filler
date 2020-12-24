import {css} from 'emotion';
import React, {Suspense, useRef, useState} from 'react';
import Button from '../components/Button';
import {auth} from '../Firebase';
import {useCurrentUser} from '../hooks/useCurrentUser';
import {LoginRef} from '../login/FirebaseLogin';

const FirebaseLogin = React.lazy(() => import('../login/FirebaseLogin'));

type Props = {
  className: string;
};

export default function SignInButton(props: Props): JSX.Element | null {
  const loginRef = useRef<LoginRef | null>(null);
  const [isRenderingFirebaseLogin, setIsRenderingFirebaseLogin] = useState(
    auth.isSignInWithEmailLink(window.location.href),
  );
  const {currentUser} = useCurrentUser();

  let text;
  if (!currentUser) {
    text = 'Sign In';
  } else {
    text = 'Sign Out';
  }

  const canLogin = !currentUser || currentUser.isAnonymous;

  return (
    <>
      {currentUser?.email && (
        <div className={styles.email}>{currentUser?.email}</div>
      )}
      <Button
        className={props.className}
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

      <Suspense fallback={null}>
        {isRenderingFirebaseLogin ? <FirebaseLogin ref={loginRef} /> : null}
      </Suspense>
    </>
  );
}

const styles = {
  email: css`
    padding: var(--s) var(--m);
  `,
};
