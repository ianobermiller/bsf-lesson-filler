import {API_KEY} from '../Firebase';
import {jsonOrThrow} from './APIUtils';

interface SignUpResult {
  idToken: string; //	A Firebase Auth ID token for the newly created user.
  email: string; //	The email for the newly created user.
  refreshToken: string; //	A Firebase Auth refresh token for the newly created user.
  expiresIn: string; //	The number of seconds in which the ID token expires.
  localId: string; //	The uid of the newly created user.
}

export async function signUp(
  email: string,
  password: string,
): Promise<SignUpResult> {
  // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  return jsonOrThrow(response, 'Could not sign up user');
}

interface SignInResult {
  idToken: string; //	A Firebase Auth ID token for the authenticated user.
  email: string; //	The email for the authenticated user.
  refreshToken: string; //	A Firebase Auth refresh token for the authenticated user.
  expiresIn: string; //	The number of seconds in which the ID token expires.
  localId: string; //	The uid of the authenticated user.
  registered: boolean; //	Whether the email is for an existing account.
}

export async function signIn(
  email: string,
  password: string,
): Promise<SignInResult> {
  // https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    },
  );

  return jsonOrThrow(response, 'Could not authenticate user');
}

interface RefreshUserResult {
  access_token: string;
  expires_in: string; //	The number of seconds in which the ID token expires.
  id_token: string; //	A Firebase Auth ID token.
  project_id: string; //	Your Firebase project ID.
  refresh_token: string; //	The Firebase Auth refresh token provided in the request or a new refresh token.
  token_type: string; //	The type of the refresh token, always "Bearer".
  user_id: string; //	The uid corresponding to the provided ID token.
}

export async function refreshUser(
  refreshToken: string,
): Promise<RefreshUserResult> {
  // https://firebase.google.com/docs/reference/rest/auth#section-refresh-token
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    },
  );

  return jsonOrThrow(response, 'Could not refresh token');
}
