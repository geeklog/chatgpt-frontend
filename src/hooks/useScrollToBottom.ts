import { RefObject, useEffect, useRef, useState } from "react";

function useScrollToBottom(): [RefObject<HTMLDivElement>, () => void] {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldUpdate, setShouldUpdate] = useState<number>(0);

  // 监听组件更新，当组件更新后自动滚动到底部
  useEffect(() => {
    if (ref.current)
      ref.current.scrollTop = ref.current.scrollHeight;
  }, [shouldUpdate]);

  const update = () => {
    setShouldUpdate(Math.random())
  }

  return [ref, update];
}

export default useScrollToBottom;