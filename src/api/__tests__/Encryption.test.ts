import {decrypt, encrypt} from '../Encryption';

it('round trips a string', async () => {
  const userID = 'sdf798ys9ad8f';
  const text = 'hello world';

  const encrypted = await encrypt(userID, text);
  const decrypted = await decrypt(userID, encrypted);

  expect(decrypted).toBe(text);
});
