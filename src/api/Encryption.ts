const IV_SIZE_IN_BYTES = 12;

export async function encrypt(
  userID: string,
  text: string,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_SIZE_IN_BYTES));
  const key = await getCryptoKey(userID, iv);
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
  const key = await getCryptoKey(userID, iv);
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

async function getCryptoKey(userID: string, salt: ArrayBuffer) {
  let encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(userID),
    {name: 'PBKDF2'},
    false,
    ['deriveBits', 'deriveKey'],
  );
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {name: 'AES-GCM', length: 256},
    true,
    ['encrypt', 'decrypt'],
  );
}
