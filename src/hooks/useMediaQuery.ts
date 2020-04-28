// https://github.com/bence-toth/react-hook-media-query/blob/master/src/index.js

import {useEffect, useState} from 'react';

export default function useMediaQuery(query: string): boolean {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    function onMatch({matches}: {matches: boolean}) {
      setIsMatch(matches);
    }

    const matcher = window.matchMedia(query);
    matcher.addEventListener('change', onMatch);

    onMatch(matcher);

    return () => {
      matcher.removeEventListener('change', onMatch);
    };
  }, [query, setIsMatch]);

  return isMatch;
}
