export function exportAnswers(answersByQuestionID: Map<string, string>) {
  // Convert the map to an object
  const answersObject = Array.from(answersByQuestionID).reduce(
    (result, [questionID, answer]) => {
      result[questionID] = answer;
      return result;
    },
    {} as {[questionID: string]: string},
  );
  const data = {
    version: 1,
    answers: answersObject,
  };
  downloadJSON(data, 'bsf-lesson-filler-export.json');
}

// https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
function downloadJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;

  const onClick = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener('click', onClick);
    }, 150);
  };
  a.addEventListener('click', onClick, false);
  a.click();
}

export function importAnswers(
  saveAnswers: (
    userID: string,
    answersByQuestionID: Map<string, string>,
  ) => void,
) {}
