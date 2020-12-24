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

const GENESIS_LESSON_DATES = [
  '2020-09-21',
  '2020-09-28',
  '2020-10-05',
  '2020-10-12',
  '2020-10-19',
  '2020-10-26',
  '2020-11-02',
  '2020-11-09',
  '2020-11-16',
  '2020-11-23',
  '2020-11-30',
  '2020-12-07',
  '2021-01-04',
  '2021-01-11',
  '2021-01-18',
  '2021-01-25',
  '2021-02-01',
  '2021-02-08',
  '2021-02-15',
  '2021-02-22',
  '2021-03-01',
  '2021-03-08',
  '2021-03-15',
  '2021-03-22',
  '2021-03-29',
  '2021-04-05',
  '2021-04-12',
  '2021-04-19',
  '2021-04-26',
  '2021-05-03',
  '2021-05-10',
];

async function fetchStudiesUncached(): Promise<Study[]> {
  const result = await fetch(`${HOST}/lessons?lang=eng`);
  const json = await result.json();
  return json.booklist.map((study: APIStudy) => {
    let title = '';
    let startYear = 2000;
    let endYear = 2000;
    const result = /(.*)(\d{4})(-(\d{2}))?/.exec(study.title);
    if (result) {
      title = result[1];
      startYear = Number(result[2]);
      endYear = result[4]
        ? Number(result[2].slice(0, 2) + result[4])
        : startYear;
    }
    return {
      title,
      startYear,
      endYear,
      lessons: study.lessons.map((lesson: APILessonEntry, index) => {
        let number = 0;
        let verses = '';
        let date = new Date(0);
        const result = /Lesson(\d+) ([^ ]+) (\((\d+)\/(\d+)\))?/.exec(
          lesson.name,
        );
        if (result) {
          number = Number(result[1]);
          verses = result[2]
            // Add spaces between <number><letter>
            .replace(/(\d)([a-z])/gi, '$1 $2')
            // Add spaces between <letter><number>
            .replace(/([a-z])(\d)/gi, '$1 $2');
          if (result[3]) {
            const month = Number(result[4]);
            date = new Date(
              month >= 9 ? startYear : endYear,
              month - 1,
              Number(result[5]),
            );
          } else if (title === 'Genesis' && startYear === 2020) {
            date = new Date(
              // Adjust timezone to Pacific
              GENESIS_LESSON_DATES[index] + 'T00:00:00.000-08:00',
            );
          }
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
  {alwaysFetch: true},
);
