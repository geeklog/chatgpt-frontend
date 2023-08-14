import { useEffect } from 'react';

export default function useLoad<T>(
  asyncFn: () => Promise<T>,
  onLoaded: (value: T) => void,
  onError?: (err: Error) => void
) {
  useEffect(() => {
    async function fetchAsyncFn() {
      try {
        const result = await asyncFn();
        onLoaded(result);
      } catch (err) {
        onError?.(err as any);
      }
    }
    fetchAsyncFn();
  }, []);
}