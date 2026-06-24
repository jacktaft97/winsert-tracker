'use client';

import { useRef, useEffect } from 'react';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AutoResizeTextarea(props: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  useEffect(() => {
    resize();
  }, []);

  return <textarea {...props} ref={ref} onInput={resize} style={{ ...props.style, overflow: 'hidden' }} />;
}
