import {useEffect, useState} from 'react';

export function useAbortableFetch<TResult>({
  doFetch,
  defaultValue,
  shouldFetch = true,
}: {
  doFetch: (signal: AbortSignal) => Promise<TResult>;
  defaultValue: TResult;
  shouldFetch?: boolean;
}): TResult | null {
  const [result, setResult] = useState<TResult>(defaultValue);
  useEffect(() => {
    if (shouldFetch) {
      const controller = new AbortController();
      doFetch(controller.signal).then(setResult);
      return () => {
        controller.abort();
      };
    }
  }, [doFetch, shouldFetch]);
  return result;
}
