import {cacheInLocalStorage} from './cacheInLocalStorage';
export const HOST = 'https://bsf.turbozv.com';

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
