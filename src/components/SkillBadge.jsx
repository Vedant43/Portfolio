export default function SkillBadge({ name, icon }) {
  return (
    <div className="skill-badge">
      <span className="skill-icon">{icon}</span>
      <span className="skill-name">{name}</span>
    </div>
  );
}
