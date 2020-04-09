const HOST = "https://bsf.turbozv.com";

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

let cachedStudies: Study[] | null;
export async function fetchStudies(): Promise<Study[]> {
  const result = await fetch(`${HOST}/lessons?lang=eng`);
  const json = await result.json();
  const studies = json.booklist.map((study: APIStudy) => {
    let title = "";
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
        let verses = "";
        let date = new Date();
        const result = /Lesson(\d+) ([^ ]+) \((\d+)\/(\d+)\)/.exec(lesson.name);
        if (result) {
          number = Number(result[1]);
          verses = result[2]
            // Add spaces between <number><letter>
            .replace(/(\d)([a-z])/gi, "$1 $2")
            // Add spaces between <letter><number>
            .replace(/([a-z])(\d)/gi, "$1 $2");
          const month = Number(result[3]);
          date = new Date(
            month >= 9 ? startYear : endYear,
            month - 1,
            Number(result[4])
          );
        }
        return {
          id: lesson.id,
          rawName: lesson.name,
          number,
          verses,
          date
        };
      })
    };
  });
  cachedStudies = studies;
  return studies;
}

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
  verses: string;
  number: number;
  memoryVerse: string;
  dayQuestions: {
    one: LessonDay;
    two: LessonDay;
    three: LessonDay;
    four: LessonDay;
    five: LessonDay;
    six: LessonDay;
  };
};
type LessonDay = {
  title: string;
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

export async function fetchLesson(
  lessonID: string,
  signal: AbortSignal
): Promise<Lesson> {
  const result = await fetch(`${HOST}/lessons/${lessonID}?lang=eng`, {
    signal
  });
  const apiLesson: APILesson = await result.json();
  return {
    ...apiLesson,
    verses:
      cachedStudies?.flatMap(s => s.lessons).find(l => l.id === lessonID)
        ?.verses ?? "",
    number: Number(/(\d+$)/.exec(lessonID)?.[1])
  };
}
