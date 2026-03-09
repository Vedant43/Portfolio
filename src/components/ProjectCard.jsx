export default function ProjectCard({ title, desc, tags, github, demo }) {
  return (
    <div className="project-card">
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{desc}</p>
      <div className="project-tags">{tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
      <div className="project-links">
        {github && <a href={github} target="_blank" rel="noreferrer" className="btn-ghost">GitHub ↗</a>}
        {demo && <a href={demo} target="_blank" rel="noreferrer" className="btn-primary">Live Demo ↗</a>}
      </div>
    </div>
  );
}
