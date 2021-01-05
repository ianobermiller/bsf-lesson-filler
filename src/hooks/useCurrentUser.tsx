import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {refreshUser, signIn, signUp} from '../api/UserAPI';

export interface User {
  email: string;
  id: string;
  idToken: string;
}

interface UserContext {
  currentUser: User | null;
  isLoadingUser: boolean;
  loginError: string | null;
  signOut: () => void;
  startSignIn: (args: {email: string; password: string}) => void;
  startSignUp: (args: {email: string; password: string}) => void;
}

export const UserContext = createContext<UserContext>({
  currentUser: null,
  isLoadingUser: false,
  loginError: null,
  signOut() {},
  startSignIn() {},
  startSignUp() {},
});

interface UserProviderProps {
  children: ReactElement;
}

export function UserProvider({children}: UserProviderProps): ReactElement {
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setIsLoadingUser(false);
    setLoginError(null);

    localStorage.removeItem('auth');
  }, []);

  const startSignIn = useCallback(
    ({email, password}: {email: string; password: string}) => {
      setIsLoadingUser(true);
      signIn(email, password)
        .then(result => {
          setCurrentUser({
            email: result.email,
            id: result.localId,
            idToken: result.idToken,
          });
          setLoginError(null);

          localStorage.setItem(
            'auth',
            JSON.stringify({
              email: result.email,
              refreshToken: result.refreshToken,
            }),
          );
        })
        .catch(err => {
          setLoginError(err.message);
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    },
    [],
  );

  const startSignUp = useCallback(
    ({email, password}: {email: string; password: string}) => {
      setIsLoadingUser(true);
      signUp(email, password)
        .then(result => {
          setCurrentUser({
            email: result.email,
            id: result.localId,
            idToken: result.idToken,
          });
          setLoginError(null);

          localStorage.setItem(
            'auth',
            JSON.stringify({
              email: result.email,
              refreshToken: result.refreshToken,
            }),
          );
        })
        .catch(err => {
          setLoginError(err.message);
        })
        .finally(() => {
          setIsLoadingUser(false);
        });
    },
    [],
  );

  useEffect(() => {
    const authJSON = localStorage.getItem('auth');
    const parsed = authJSON && JSON.parse(authJSON);
    if (parsed) {
      refreshUser(parsed.refreshToken).then(result => {
        setCurrentUser({
          email: parsed.email,
          id: result.user_id,
          idToken: result.id_token,
        });
        setIsLoadingUser(false);
        setLoginError(null);

        localStorage.setItem(
          'auth',
          JSON.stringify({
            email: parsed.email,
            refreshToken: result.refresh_token,
          }),
        );
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isLoadingUser,
      loginError,
      signOut,
      startSignIn,
      startSignUp,
    }),
    [currentUser, isLoadingUser, loginError, signOut, startSignIn, startSignUp],
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useCurrentUser(): {currentUser: User | null} {
  const {currentUser} = useContext(UserContext);
  return {currentUser};
}
