import { useEffect, useRef } from "react";
export default function ProgressBar({ level, color="#6366f1" }) {
  const ref = useRef();
  useEffect(() => {
    setTimeout(() => { if(ref.current) ref.current.style.width = level+"%"; }, 200);
  }, [level]);
  return (
    <div style={{background:"rgba(255,255,255,0.08)",borderRadius:4,height:6,overflow:"hidden"}}>
      <div ref={ref} style={{width:0,height:"100%",background:color,borderRadius:4,transition:"width 1s ease"}} />
    </div>
  );
}
