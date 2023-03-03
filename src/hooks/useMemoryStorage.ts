import { useEffect, useState } from "react";

declare global {
  interface Window {
    __memoryPersistStorage: Record<string, any>;
  }
}

function useMemoryStorage<T>(key: string, initialValue: T) {
  window.__memoryPersistStorage = window.__memoryPersistStorage || {};
  
  const [state, setState] = useState(() => {
    const storedValue = window.__memoryPersistStorage[key];
    return storedValue !== undefined ? JSON.parse(storedValue) : initialValue;
  });
  
  useEffect(() => {
    window.__memoryPersistStorage[key] = JSON.stringify(state);
  }, [key, state]);
  
  return [state, setState];
}

export default useMemoryStorage