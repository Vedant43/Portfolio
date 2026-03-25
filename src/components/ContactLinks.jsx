export default function ContactLinks() {
  const links = [
    { label:"Email", href:"mailto:bhavikpatel773241@gmail.com" },
    { label:"GitHub", href:"https://github.com/bhavik41" },
    { label:"LinkedIn", href:"https://linkedin.com/in/bhavik41" },
  ];
  return (
    <div className="contact-links">
      {links.map(l => <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="contact-link">{l.label} ↗</a>)}
    </div>
  );
}
