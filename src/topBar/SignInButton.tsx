import React, {useContext, useState} from 'react';
import Button from '../components/Button';
import {UserContext} from '../hooks/useCurrentUser';
import {SignInModal} from './SignInModal';

type Props = {
  className?: string;
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
      <Button
        className={props.className}
        onClick={() => {
          if (currentUser) {
            signOut();
            setIsShowingModal(false);
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
