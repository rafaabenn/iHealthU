import '../styles/components.css';

export default function Panel({ title, actionText, onAction, children }) {
  return (
    <div className="panel">
      {(title || actionText) && (
        <div className="panel-header">
          {title && <div className="panel-title">{title}</div>}
          {actionText && (
            <div className="panel-action" onClick={onAction}>
              {actionText}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}