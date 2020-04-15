import {css} from 'emotion';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import React, {useEffect, useState} from 'react';

export function FirebaseLogin(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  useEffect(() => {
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    const anonymousUser = firebase.auth().currentUser;
    const uiConfig: firebaseui.auth.Config = {
      callbacks: {
        // signInSuccessWithAuthResult(authResult, redirectUrl) {
        //   // Process result. This will not trigger on merge conflicts.
        //   // On success redirect to signInSuccessUrl.
        //   return true;
        // },
        // // signInFailure callback must be provided to handle merge conflicts which
        // // occur when an existing credential is linked to an anonymous user.
        // async signInFailure(error) {
        //   // For merge conflicts, the error.code will be
        //   // 'firebaseui/anonymous-upgrade-merge-conflict'.
        //   if (
        //     error.code !== 'firebaseui/anonymous-upgrade-merge-conflict' ||
        //     !anonymousUser
        //   ) {
        //     return Promise.resolve();
        //   }
        //   // The credential the user tried to sign in with.
        //   const cred = error.credential;
        //   await firebase.auth().signInWithCredential(cred);
        //   await anonymousUser.delete();
        // },
      },
      signInOptions: [
        // {
        //   provider: firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID,
        // },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          requireDisplayName: false,
          signInMethod:
            firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        },
      ],
      // autoUpgradeAnonymousUsers: false,
    };

    // if (ui.isPendingRedirect()) {
    //   ui.start('#firebaseui-auth-container', uiConfig);
    //   setIsVisible(true);
    // }

    // Confirm the link is a sign-in with email link.
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        .signInWithEmailLink('ian@obermillers.com', window.location.href)
        .then(function (result) {
          console.log('success', result);
        })
        .catch(function (error) {
          console.log('error', error);
        });
    }

    return firebase.auth().onAuthStateChanged(user => {
      console.log({user});
      if (user) {
        setIsVisible(false);
      } else {
        ui.start('#firebaseui-auth-container', uiConfig);
        setIsVisible(true);
      }
    });
  }, []);

  return (
    <div
      className={styles.root}
      id="firebaseui-auth-container"
      style={{display: isVisible ? undefined : 'none'}}
    />
  );
}

const styles = {
  root: css`
    background: var(--control-background-active);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;

    .firebaseui-id-page-blank,
    .firebaseui-page-provider-sign-in {
      background: none;
    }
  `,
};
