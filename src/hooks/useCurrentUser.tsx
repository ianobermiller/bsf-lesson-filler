import type {User} from 'firebase';
import {useEffect, useState} from 'react';
import {auth} from '../Firebase';

export function useCurrentUser(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  useEffect(() => auth.onAuthStateChanged(setCurrentUser), []);
  return currentUser;
}
