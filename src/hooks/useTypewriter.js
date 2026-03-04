import { useState, useEffect } from "react";
export function useTypewriter(words, speed=80) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    let i = 0;
    const word = words[idx % words.length];
    const t = setInterval(() => {
      setText(word.slice(0, ++i));
      if (i >= word.length) { clearInterval(t); setTimeout(() => setIdx(p=>p+1), 1200); }
    }, speed);
    return () => clearInterval(t);
  }, [idx]);
  return text;
}
