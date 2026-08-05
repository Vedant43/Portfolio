export default function ContactLinks() {
  const links = [
    { label:"Email", href:"mailto:vedant.suthar03@gmail@gmail.com" },
    { label:"GitHub", href:"https://github.com/Vedant43" },
    { label:"LinkedIn", href:"https://linkedin.com/in/Vedant43" },
  ];
  return (
    <div className="contact-links">
      {links.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="contact-link">{l.label} ↗</a>)}
    </div>
  );
}

// Resume download button stub
