import { useState, useEffect } from "react";
const LINKS = ["About","Skills","Projects","Contact"];
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <span className="logo">BP.</span>
      <ul className="nav-links">
        {LINKS.map(l => <li key={l}><a href={"#"+l.toLowerCase()}>{l}</a></li>)}
      </ul>
    </nav>
  );
}
