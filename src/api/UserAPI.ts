import {API_KEY} from '../Firebase';

const MESSAGE_BY_ERROR_CODE: {[code: string]: string} = {
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER:
    'We have blocked all requests from this device due to unusual activity. Try again later.',
  EMAIL_NOT_FOUND:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_PASSWORD:
    'The password is invalid or the user does not have a password.',
  USER_DISABLED: 'The user account has been disabled by an administrator.',
  USER_NOT_FOUND:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_EMAIL: 'The email address is badly formatted.',
  INVALID_ID_TOKEN: 'The credential is no longer valid. Please sign in again.',
  TOKEN_EXPIRED: 'The credential is no longer valid. Please sign in again.',
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
    'The credential is no longer valid. Please sign in again.',
  WEAK_PASSWORD: 'The password must be 6 characters long or more.',
};

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

async function jsonOrThrow<T>(
  response: Response,
  defaultMessage: string,
): Promise<T> {
  const json = await response.json();

  if (response.status === 200) {
    return json;
  }

  const code = json?.error?.message ?? '';
  throw new Error(MESSAGE_BY_ERROR_CODE[code] ?? defaultMessage);
}
