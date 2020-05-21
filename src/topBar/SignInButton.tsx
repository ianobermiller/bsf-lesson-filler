import {css} from 'emotion';
import React, {Suspense, useState} from 'react';
import Button from '../components/Button';
import {auth} from '../Firebase';
import {useCurrentUser} from '../hooks/useCurrentUser';
import useMediaQuery from '../hooks/useMediaQuery';
import {TABLET} from '../styles/MediaQueries';

const FirebaseLogin = React.lazy(() => import('../login/FirebaseLogin'));

export default function SignInButton(): JSX.Element | null {
  const isTablet = useMediaQuery(TABLET);
  const [isRenderingFirebaseLogin, setIsRenderingFirebaseLogin] = useState(
    false,
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
        {isTablet && <div className={styles.email}>{currentUser?.email}</div>}
        <Button
          onClick={() => {
            if (canLogin) {
              setIsRenderingFirebaseLogin(true);
            } else {
              auth.signOut();
            }
          }}>
          {text}
        </Button>
      </div>

      <Suspense fallback={null}>
        {isRenderingFirebaseLogin ? <FirebaseLogin /> : null}
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
