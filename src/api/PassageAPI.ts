import {cacheInLocalStorage} from './cacheInLocalStorage';

// default from biblia.com, only works on localhost
const BIBLIA_API_KEY = '873b4ffb8d4aef522fdf4d2274392707';

export type VerseScan = {
  passage: string;
  textIndex: number;
  textLength: number;
};

async function scanForVersesUncached(text: string): Promise<VerseScan[]> {
  const result = await fetch(
    `https://api.biblia.com/v1/bible/scan?text=${text}&key=${BIBLIA_API_KEY}`,
  );
  const json = await result.json();
  return json.results;
}

export const scanForVerses = cacheInLocalStorage(
  scanForVersesUncached,
  (text: string) => `scanForVerses-${text}`,
  (text: string) => {
    // Don't scan if the only number is at the front (like the question number)
    if (text.match(/^(\d+\.)?\D+$/)) {
      return [];
    }
  },
);

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
