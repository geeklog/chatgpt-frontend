import { useState, useRef, useCallback } from 'react';

export default function useSignal<T>(initialValue: T): [() => T, (newValue: T) => void] {
  const [_, setValue] = useState(initialValue);
  const ref = useRef(initialValue);
  const getter = useCallback(() => {
    return ref.current;
  }, []);
  const setter = useCallback((newValue: T) => {
    ref.current = newValue;
    setValue(newValue);
  }, []);
  return [getter, setter];
}