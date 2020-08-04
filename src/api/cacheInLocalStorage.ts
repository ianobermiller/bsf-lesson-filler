import serialize from 'serialize-javascript';

export function cacheInLocalStorage<
  TReturn,
  T extends (...args: any[]) => Promise<TReturn>
>(
  fetchData: (...args: Parameters<T>) => Promise<TReturn>,
  getKey: (...args: Parameters<T>) => string,
  options?: {
    alwaysFetch?: boolean;
    shortCircut?: (...args: Parameters<T>) => TReturn | void;
  },
): (...args: Parameters<T>) => Promise<TReturn> {
  return async (...args: Parameters<T>): Promise<TReturn> => {
    const shortCircuitResult = options?.shortCircut?.(...args);
    if (shortCircuitResult !== undefined) {
      return shortCircuitResult;
    }

    async function fetchAndCache() {
      const result = await fetchData(...args);
      localStorage.setItem(key, serialize(result));
      return result;
    }

    // Check local storage for cached results
    const key = getKey(...args);
    const cached = localStorage.getItem(key);
    if (cached) {
      // Fetch and cache so the data will be there on the next reload
      if (options?.alwaysFetch) {
        fetchAndCache();
      }

      // Recommended way to deserialize from this library
      // eslint-disable-next-line no-eval
      return eval(`(${cached})`);
    }

    return fetchAndCache();
  };
}
