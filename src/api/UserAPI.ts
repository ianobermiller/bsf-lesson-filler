/**
 * High-level API for signing up and in users. Saves token to local storage,
 * verifies logged in status, etc.
 */

import mitt from 'mitt';
import {firebaseSignIn} from './FirebaseUserAPI';

const emitter = mitt();

export async function signIn(email: string, password: string): Promise<void> {
  const result = await firebaseSignIn(email, password);
}
