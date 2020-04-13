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

const NLT_API_KEY = '3f0df355-5d09-40bd-a499-8b79e8a83952';

async function fetchNLTPassageHTMLUncached(
  verse: string,
  signal: AbortSignal,
): Promise<string> {
  const result = await fetch(
    `http://api.nlt.to/api/passages?ref=${verse}&key=${NLT_API_KEY}`,
    {signal},
  );
  const html = await result.text();
  return html.replace(/[\s\S]*<body>/, '').replace(/<\/body>[\s\S]*/, '');
}

export const fetchNLTPassageHTML = cacheInLocalStorage(
  fetchNLTPassageHTMLUncached,
  verse => `fetchNLTPassageHTML-${verse}`,
);
