export default function Timeline({ items }) {
  return (
    <ul className="timeline">
      {items.map((it,i) => (
        <li key={i} className="timeline-item">
          <span className="timeline-dot" />
          <div>
            <strong>{it.title}</strong>
            <span className="timeline-date">{it.date}</span>
            <p>{it.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
