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
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

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

  const refresh = useCallback(async () => {
    const authJSON = localStorage.getItem('auth');
    const parsed = authJSON && JSON.parse(authJSON);
    if (!parsed) {
      return;
    }

    const result = await refreshUser(parsed.refreshToken);

    setCurrentUser({
      email: parsed.email,
      id: result.user_id,
      idToken: result.id_token,
    });
    setIsLoadingUser(false);
    setLoginError(null);
    setExpiresAt(Math.floor(Date.now() / 1000) + parseInt(result.expires_in));

    localStorage.setItem(
      'auth',
      JSON.stringify({
        email: parsed.email,
        refreshToken: result.refresh_token,
      }),
    );
  }, []);

  // Refresh the token on first load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Refresh the token if it expires
  useEffect(() => {
    if (expiresAt == null) {
      return;
    }

    const intervalID = setInterval(() => {
      if (Date.now() / 1000 >= expiresAt) {
        refresh();
      }
    }, 1000);
    return () => clearInterval(intervalID);
  }, [expiresAt, refresh]);

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
