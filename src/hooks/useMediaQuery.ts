// https://github.com/bence-toth/react-hook-media-query/blob/master/src/index.js

import {useEffect, useMemo, useState} from 'react';

export default function useMediaQuery(query: string): boolean {
  const matcher = useMemo(() => window.matchMedia(query), [query]);
  const [isMatch, setIsMatch] = useState(matcher.matches);

  useEffect(() => {
    function onMatch({matches}: {matches: boolean}) {
      setIsMatch(matches);
    }

    matcher.addListener(onMatch);

    onMatch(matcher);

    return () => {
      matcher.removeListener(onMatch);
    };
  }, [matcher, setIsMatch]);

  return isMatch;
}
