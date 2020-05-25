const IV_SIZE_IN_BYTES = 12;

export async function encrypt(
  userID: string,
  text: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE_IN_BYTES));
  const key = await getCryptoKey(userID);
  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoded,
  );
  const withIV = new Uint8Array(iv.byteLength + encrypted.byteLength);
  withIV.set(iv, 0);
  withIV.set(new Uint8Array(encrypted), iv.length);
  return withIV;
}

export async function decrypt(
  userID: string,
  encrypted: ArrayBuffer,
): Promise<string> {
  const iv = encrypted.slice(0, IV_SIZE_IN_BYTES);
  const key = await getCryptoKey(userID);
  const encoded = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encrypted.slice(IV_SIZE_IN_BYTES),
  );

  const decoder = new TextDecoder();
  return decoder.decode(encoded);
}

async function getCryptoKey(userID: string) {
  let enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    'raw',
    enc.encode(userID),
    {name: 'PBKDF2'},
    false,
    ['deriveBits', 'deriveKey'],
  );
}
