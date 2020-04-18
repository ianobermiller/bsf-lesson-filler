import React from 'react';
import Button from '../components/Button';
import {auth} from '../Firebase';
import {useCurrentUser} from '../hooks/useCurrentUser';

export default function SignInButton(): JSX.Element | null {
  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  let text;
  if (currentUser.isAnonymous) {
    text = 'Sign In with Email';
  } else {
    text = 'Sign Out';
  }
  return (
    <Button
      onClick={() => {
        if (currentUser.isAnonymous) {
          // TODO: Tell the login component to show the UI
        } else {
          auth.signOut();
        }
      }}>
      {text}
    </Button>
  );
}
