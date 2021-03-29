import STUDIES_DATA from './data.json';

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
  quotes: APIQuote[];
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
  quotes: Quote[];
};
type Quote = {
  book: string;
  verse: string;
};

export async function fetchLesson(
  lessonID: string,
  signal: AbortSignal,
): Promise<Lesson> {
  // const result = await fetch(`${HOST}/lessons/${lessonID}?lang=eng`, {
  //   signal,
  // });
  // const {dayQuestions, ...otherApiLesson}: APILesson = await result.json();

  const {dayQuestions, ...otherApiLesson}: APILesson =
    // @ts-ignore
    STUDIES_DATA[`LESSON/${lessonID}?lang=eng`];
  return {
    ...otherApiLesson,
    number: Number(/(\d+$)/.exec(lessonID)?.[1]),
    days: Object.values(dayQuestions).map(apiDay => {
      const [title, note = ''] = apiDay.title.split('\n');
      return {
        title: title.replace(/ ?\.$/, '').trim(),
        note: note.trim(),
        questions: apiDay.questions.map(({id, questionText, quotes}) => ({
          id: id.trim(),
          questionText: questionText.trim(),
          quotes: quotes.map(({book, verse}) => ({
            book: book.trim(),
            verse: verse.trim(),
          })),
        })),
        readVerse: apiDay.readVerse?.map(({book, verse}) => ({
          book: book.trim(),
          verse: verse.trim(),
        })),
      };
    }),
  };
}

// export const fetchLesson = cacheInLocalStorage(
//   fetchLessonUncached,
//   lessonID => `lesson-${lessonID}`,
//   {alwaysFetch: true},
// );
