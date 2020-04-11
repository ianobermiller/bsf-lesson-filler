import {cacheInLocalStorage} from './cacheInLocalStorage';

const ESV_API_KEY = 'af6bd99bf499439955bc65857f56eb432ab657ad';

async function fetchESVPassageHTMLUncached(
  verse: string,
  signal: AbortSignal,
): Promise<string> {
  const result = await fetch(
    `https://api.esv.org/v3/passage/html/?q=${verse}`,
    {headers: {Authorization: `Token ${ESV_API_KEY}`}, signal},
  );
  const json = await result.json();
  return json.passages[0];
}

export const fetchESVPassageHTML = cacheInLocalStorage(
  fetchESVPassageHTMLUncached,
  verse => `fetchESVPassageHTML-${verse}`,
);
