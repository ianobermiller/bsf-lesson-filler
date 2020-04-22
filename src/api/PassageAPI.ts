import {cacheInLocalStorage} from './cacheInLocalStorage';

const ESV_API_KEY = 'af6bd99bf499439955bc65857f56eb432ab657ad';

async function fetchESVPassageHTMLUncached(
  verse: string,
  signal: AbortSignal,
): Promise<string> {
  const result = await fetch(
    `https://api.esv.org/v3/passage/html/?q=${encodeVerse(verse)}`,
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
    `http://api.nlt.to/api/passages?ref=${encodeVerse(
      verse,
    )}&key=${NLT_API_KEY}`,
    {signal},
  );
  const html = await result.text();
  return html.replace(/[\s\S]*<body>/, '').replace(/<\/body>[\s\S]*/, '');
}

export const fetchNLTPassageHTML = cacheInLocalStorage(
  fetchNLTPassageHTMLUncached,
  verse => `fetchNLTPassageHTML-${verse}`,
);

const BIBLE_ID = {
  ASV: '06125adad2d5898a-01',
  NIV: '78a9f6124f344018-01',
};
const API_DOT_BIBLE_KEY = '54ad7ea9f47a0604c78a7feb795af838';

// https://api.scripture.api.bible/v1/bibles/06125adad2d5898a-01/search?query=James%201-2&sort=canonical

async function fetchNIVPassageHTMLUncached(
  verse: string,
  signal: AbortSignal,
): Promise<string> {
  const idResult = await fetch(
    `https://api.scripture.api.bible/v1/bibles/${
      BIBLE_ID.ASV
    }/search?sort=canonical&query=${encodeVerse(verse)}`,
    {
      headers: {
        'api-key': API_DOT_BIBLE_KEY,
      },
      signal,
    },
  );
  const idJson = await idResult.json();
  const passageID = idJson.data?.passages?.[0]?.id;

  const result = await fetch(
    `https://bibles.org/site-assets/passages/${passageID}?bibleId=${BIBLE_ID.NIV}`,
    {signal},
  );
  const json = await result.json();

  const data = json.passage?.data;
  const content = data?.content;

  if (content) {
    return `<h2>${data?.reference}</h2>${content}`;
  }

  return '';
}

export const fetchNIVPassageHTML = cacheInLocalStorage(
  fetchNIVPassageHTMLUncached,
  verse => `fetchNIVPassageHTML-${verse}`,
);

function encodeVerse(verse: string): string {
  return encodeURIComponent(verse).replace('%E2%80%93', '-');
}
