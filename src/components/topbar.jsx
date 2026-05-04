import '../styles/components.css';

export default function Topbar({ subtitle, title, streak, onNotification }) {
  return (
    <div className="topbar">
      <div>
        {subtitle && <div className="page-title-sm">{subtitle}</div>}
        <div className="page-title" dangerouslySetInnerHTML={{ __html: title }} />
      </div>
      <div className="topbar-right">
        {streak && <div className="streak-chip">🔥 {streak}-day streak</div>}
        <div className="notif-btn" onClick={onNotification}>🔔</div>
      </div>
    </div>
  );
}