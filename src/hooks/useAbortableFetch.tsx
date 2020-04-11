import {useEffect, useState} from 'react';

type Fetcher<TResult> = (signal: AbortSignal) => Promise<TResult>;

/**
 * The doFetch function MUST be memoized. This hook automatically handles out of
 * order responses by aborting the previous response before kicking off the next
 * one.
 **/
export function useAbortableFetch<TResult>({
  doFetch,
  defaultValue,
  shouldFetch = true,
}: {
  doFetch: Fetcher<TResult>;
  defaultValue: TResult;
  shouldFetch?: boolean;
}): {error: unknown; isLoading: boolean; result: TResult | null} {
  const [error, setError] = useState<unknown>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TResult>(defaultValue);

  useEffect(() => {
    if (shouldFetch) {
      const controller = new AbortController();
      setIsLoading(true);
      doFetch(controller.signal)
        .then(setResult)
        .catch(setError)
        .finally(() => setIsLoading(false));

      return () => {
        controller.abort();
      };
    }
  }, [doFetch, shouldFetch]);

  return {error, isLoading, result};
}
