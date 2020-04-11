import {cacheInLocalStorage} from './cacheInLocalStorage';

const BIBLIA_API_KEY = '873b4ffb8d4aef522fdf4d2274392707';

export type ReferenceResult = {
  passage: string;
  textIndex: number;
  textLength: number;
};

async function scanForReferencesUncached(
  text: string,
): Promise<ReferenceResult[]> {
  const result = await fetch(
    `https://api.biblia.com/v1/bible/scan?text=${text}&key=${BIBLIA_API_KEY}`,
  );
  const json = await result.json();
  return json.results;
}
export const scanForReferences = cacheInLocalStorage(
  scanForReferencesUncached,
  (text: string) => `scanForVerses-${text}`,
  (text: string) => {
    // Don't scan if the only number is at the front (like the question number)
    if (text.match(/^(\d+\.)?\D+$/)) {
      return [];
    }
  },
);
