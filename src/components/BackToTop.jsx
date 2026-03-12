import { useState, useEffect } from "react";
export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!show) return null;
  return (
    <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
      style={{position:"fixed",bottom:24,right:24,background:"#6366f1",color:"#fff",border:"none",borderRadius:"50%",width:44,height:44,cursor:"pointer",fontSize:20,zIndex:999,boxShadow:"0 4px 16px rgba(99,102,241,0.4)"}}>
      ↑
    </button>
  );
}
