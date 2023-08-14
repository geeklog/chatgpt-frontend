import { useEffect } from 'react';


export default function useEffectOnce(handler: () => void, id?: string) {
  id = id || `${Math.random()}`.replace('0.', '');
  
  useEffect(() => {
    if ((window as any)[`__useEffectOnce__${id}`]) {
      return;
    }
    (window as any)[`__useEffectOnce__${id}`] = 1;
    handler();
  }, [0]);
}