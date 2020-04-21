import {css} from 'emotion';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {migrateUser} from '../api/AnswersAPI';
import {auth} from '../Firebase';

export type LoginRef = {
  hide: () => void;
  show: () => void;
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

type Props = {};

const FirebaseLogin: React.RefForwardingComponent<LoginRef, Props> = (
  _,
  ref,
) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const uiConfig = useMemo<firebaseui.auth.Config>(() => {
    return {
      callbacks: {
        signInSuccessWithAuthResult(authResult, redirectUrl) {
          setIsVisible(false);
          // Return false to not redirect
          return false;
        },
        // signInFailure callback must be provided to handle merge conflicts which
        // occur when an existing credential is linked to an anonymous user.
        async signInFailure(error) {
          const anonymousUser = firebase.auth().currentUser;
          if (
            error.code !== 'firebaseui/anonymous-upgrade-merge-conflict' ||
            !anonymousUser
          ) {
            return Promise.resolve();
          }

          migrateUser(anonymousUser, error.credential);
          setIsVisible(false);
        },
      },
      signInOptions: [
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
          signInMethod:
            firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        },
      ],
      autoUpgradeAnonymousUsers: true,
    };
  }, []);

  const show = useCallback(() => {
    ui.start('#firebaseui-auth-container', uiConfig);
    setIsVisible(true);
  }, [uiConfig]);

  const hide = useCallback(() => {
    ui.reset();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (ui.isPendingRedirect()) {
      show();
    }

    return firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        auth.signInAnonymously();
      }
    });
  }, [show]);

  useImperativeHandle(ref, () => ({hide, show}));

  return (
    <div
      className={styles.root}
      style={{display: isVisible ? undefined : 'none'}}>
      <div id="firebaseui-auth-container" />
    </div>
  );
};

const styles = {
  root: css`
    background: var(--control-background-active);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1;

    .firebaseui-id-page-blank,
    .firebaseui-page-provider-sign-in {
      background: none;
    }
  `,
};

export default React.forwardRef(FirebaseLogin);
