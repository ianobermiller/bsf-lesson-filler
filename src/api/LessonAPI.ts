import {cacheInLocalStorage} from './cacheInLocalStorage';
import {HOST} from './StudiesAPI';

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
export type LessonDay = {
  title: string;
  note: string;
  questions: Question[];
  readVerse?: Quote[];
};
export type Question = {
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
  {alwaysFetch: true},
);
