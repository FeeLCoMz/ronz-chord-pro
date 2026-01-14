import React from 'react';

export default function KeyboardShortcutsHelp({ shortcuts, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(2px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(600px, 94vw)',
          maxHeight: '85vh',
          overflow: 'auto',
          background: 'linear-gradient(135deg, var(--card) 0%, var(--bg-elevated) 100%)',
          color: 'var(--text)',
          border: '1px solid rgba(var(--primary-rgb, 99, 102, 241), 0.3)',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: '16px',
          padding: '2rem',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid rgba(var(--primary-rgb, 99, 102, 241), 0.2)',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text)',
          }}>
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(var(--primary-rgb, 99, 102, 241), 0.1)',
              color: 'var(--text-secondary)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(var(--primary-rgb, 99, 102, 241), 0.2)';
              e.target.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(var(--primary-rgb, 99, 102, 241), 0.1)';
              e.target.style.color = 'var(--text-secondary)';
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {shortcuts.map((shortcut, index) => (
            <React.Fragment key={index}>
              <div style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '0.5rem 0.75rem',
                background: 'rgba(var(--primary-rgb, 99, 102, 241), 0.15)',
                border: '1px solid rgba(var(--primary-rgb, 99, 102, 241), 0.3)',
                borderRadius: '6px',
                color: 'var(--primary-light)',
                whiteSpace: 'nowrap',
              }}>
                {shortcut.keys}
              </div>
              <div style={{
                padding: '0.5rem 0',
                color: 'var(--text-secondary)',
                alignSelf: 'center',
              }}>
                {shortcut.action}
              </div>
            </React.Fragment>
          ))}
        </div>

        <div style={{
          padding: '1rem',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
        }}>
          <strong style={{ color: 'var(--info)', display: 'block', marginBottom: '0.5rem' }}>
            💡 Tips:
          </strong>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
            <li>Keyboard shortcuts won't work while typing in an input field</li>
            <li>Press <kbd>?</kbd> anytime to view these shortcuts</li>
            <li>Arrow keys work in any view to navigate songs</li>
            <li>Performance mode has additional touch/mouse gestures</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          style={{
            background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)`,
            color: '#fff',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            marginTop: '1.5rem',
            width: '100%',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `0 8px 16px rgba(var(--primary-rgb, 99, 102, 241), 0.4)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Got it! Close
        </button>
      </div>
    </div>
  );
}
