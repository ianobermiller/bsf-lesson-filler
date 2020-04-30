import {css} from 'emotion';
import React, {useRef} from 'react';
import Button from '../components/Button';
import {auth} from '../Firebase';
import {useCurrentUser} from '../hooks/useCurrentUser';
import useMediaQuery from '../hooks/useMediaQuery';
import FirebaseLogin, {LoginRef} from '../login/FirebaseLogin';
import {TABLET} from '../styles/MediaQueries';

export default function SignInButton(): JSX.Element | null {
  const isTablet = useMediaQuery(TABLET);
  const loginRef = useRef<LoginRef | null>(null);
  const currentUser = useCurrentUser();

  let text;
  if (!currentUser) {
    text = 'Sign In';
  } else if (currentUser.isAnonymous) {
    text = 'Sign In with Email';
  } else {
    text = 'Sign Out';
  }

  return (
    <>
      <div className={styles.root}>
        {isTablet && <div className={styles.email}>{currentUser?.email}</div>}
        <Button
          onClick={() => {
            if (!currentUser) {
              loginRef.current?.show();
            } else if (currentUser.isAnonymous) {
              loginRef.current?.show();
            } else {
              auth.signOut();
            }
          }}>
          {text}
        </Button>
      </div>

      <FirebaseLogin ref={loginRef} />
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
