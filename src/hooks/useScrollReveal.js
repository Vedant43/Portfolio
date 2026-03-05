import { useEffect, useRef } from "react";
export function useScrollReveal(threshold=0.15) {
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.target.classList.toggle("revealed", e.isIntersecting), { threshold });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}
