import serialize from 'serialize-javascript';

const HOST = 'https://bsf.turbozv.com';

type APILessonEntry = {
  id: string;
  name: string;
};

type APIStudy = {
  title: string;
  lessons: APILessonEntry[];
};

export type LessonEntry = {
  id: string;
  rawName: string;
  number: number;
  verses: string;
  date: Date;
};

export type Study = {
  endYear: number;
  lessons: LessonEntry[];
  startYear: number;
  title: string;
};

async function fetchStudiesUncached(): Promise<Study[]> {
  const result = await fetch(`${HOST}/lessons?lang=eng`);
  const json = await result.json();
  return json.booklist.map((study: APIStudy) => {
    let title = '';
    let startYear = 2000;
    let endYear = 2000;
    const result = /(.*)(\d{4})-(\d{2})/.exec(study.title);
    if (result) {
      title = result[1];
      startYear = Number(result[2]);
      endYear = Number(result[2].slice(0, 2) + result[3]);
    }
    return {
      title,
      startYear,
      endYear,
      lessons: study.lessons.map((lesson: APILessonEntry) => {
        let number = 0;
        let verses = '';
        let date = new Date();
        const result = /Lesson(\d+) ([^ ]+) \((\d+)\/(\d+)\)/.exec(lesson.name);
        if (result) {
          number = Number(result[1]);
          verses = result[2]
            // Add spaces between <number><letter>
            .replace(/(\d)([a-z])/gi, '$1 $2')
            // Add spaces between <letter><number>
            .replace(/([a-z])(\d)/gi, '$1 $2');
          const month = Number(result[3]);
          date = new Date(
            month >= 9 ? startYear : endYear,
            month - 1,
            Number(result[4]),
          );
        }
        return {
          id: lesson.id,
          rawName: lesson.name,
          number,
          verses,
          date,
        };
      }),
    };
  });
}

export const fetchStudies = cacheInLocalStorage(
  fetchStudiesUncached,
  () => 'studies',
);

type APILesson = {
  id: string;
  name: string;
  memoryVerse: string;
  dayQuestions: {
    one: APILessonDay;
    two: APILessonDay;
    three: APILessonDay;
    four: APILessonDay;
    five: APILessonDay;
    six: APILessonDay;
  };
};
type APILessonDay = {
  title: string;
  questions: APIQuestion[];
  readVerse?: APIQuote[];
};
type APIQuestion = {
  id: string;
  questionText: string;
  quotes: APIQuote;
};
type APIQuote = {
  book: string;
  verse: string;
};

export type Lesson = {
  id: string;
  number: number;
  memoryVerse: string;
  days: LessonDay[];
};
type LessonDay = {
  title: string;
  note: string;
  questions: Question[];
  readVerse?: Quote[];
};
type Question = {
  id: string;
  questionText: string;
  quotes: Quote;
};
type Quote = {
  book: string;
  verse: string;
};

async function fetchLessonUncached(
  lessonID: string,
  signal: AbortSignal,
): Promise<Lesson> {
  const result = await fetch(`${HOST}/lessons/${lessonID}?lang=eng`, {
    signal,
  });
  const {dayQuestions, ...otherApiLesson}: APILesson = await result.json();
  return {
    ...otherApiLesson,
    number: Number(/(\d+$)/.exec(lessonID)?.[1]),
    days: Object.values(dayQuestions).map(apiDay => {
      const [title, note] = apiDay.title.split('\n');
      return {
        title,
        note,
        questions: apiDay.questions,
        readVerse: apiDay.readVerse,
      };
    }),
  };
}

export const fetchLesson = cacheInLocalStorage(
  fetchLessonUncached,
  lessonID => `lesson-${lessonID}`,
);

// default from biblia.com, only works on localhost
const BIBLIA_API_KEY = 'fd37d8f28e95d3be8cb4fbc37e15e18e';

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

function cacheInLocalStorage<
  TReturn,
  T extends (...args: any[]) => Promise<TReturn>
>(
  fetchData: (...args: Parameters<T>) => Promise<TReturn>,
  getKey: (...args: Parameters<T>) => string,
  shortCircut?: (...args: Parameters<T>) => TReturn | void,
): (...args: Parameters<T>) => Promise<TReturn> {
  return async (...args: Parameters<T>): Promise<TReturn> => {
    const shortCircuitResult = shortCircut?.(...args);
    if (shortCircuitResult !== undefined) {
      return shortCircuitResult;
    }

    // Check local storage for cached results
    const key = getKey(...args);
    const cached = localStorage.getItem(key);
    if (cached) {
      // Recommended way to deserialize from this library
      // eslint-disable-next-line no-eval
      return eval(`(${cached})`);
    }

    const result = await fetchData(...args);

    localStorage.setItem(key, serialize(result));

    return result;
  };
}
