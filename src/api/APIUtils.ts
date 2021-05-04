const MESSAGE_BY_ERROR_CODE: {[code: string]: string} = {
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
    'The credential is no longer valid. Please sign in again.',
  EMAIL_EXISTS: 'The email address is already in use by another account.',
  EMAIL_NOT_FOUND:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_EMAIL: 'The email address is badly formatted.',
  INVALID_ID_TOKEN: 'The credential is no longer valid. Please sign in again.',
  INVALID_PASSWORD:
    'The password is invalid or the user does not have a password.',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOKEN_EXPIRED: 'The credential is no longer valid. Please sign in again.',
  TOO_MANY_ATTEMPTS_TRY_LATER:
    'We have blocked all requests from this device due to unusual activity. Try again later.',
  USER_DISABLED: 'The user account has been disabled by an administrator.',
  USER_NOT_FOUND:
    'There is no user record corresponding to this identifier. The user may have been deleted.',
  WEAK_PASSWORD: 'The password must be 6 characters long or more.',
};

interface ErrorWithCode extends Error {
  code: string;
}

interface FetchParams extends RequestInit {
  url: string;
  defaultErrorMessage: string;
}

export async function fetchJSON<T>(params: FetchParams): Promise<T> {
  const result = await fetch(params.url, params);
  return jsonOrThrow(result, params.defaultErrorMessage);
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
  let message = MESSAGE_BY_ERROR_CODE[code];
  if (!message && response.status === 401) {
    message = MESSAGE_BY_ERROR_CODE.INVALID_ID_TOKEN;
  }
  const error = new Error(message ?? defaultMessage) as ErrorWithCode;
  error.code = code;
  throw error;
}
