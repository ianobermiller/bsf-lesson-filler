import type {User} from 'firebase';
import {useEffect, useState} from 'react';
import {auth} from '../Firebase';

export function useCurrentUser(): {
  currentUser: User | null;
  isLoadingUser: boolean;
} {
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => {
    return auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setIsLoadingUser(false);
    });
  }, []);
  return {currentUser, isLoadingUser};
}
