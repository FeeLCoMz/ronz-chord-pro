import React, { useState, useRef, useEffect } from 'react';

export default function HeaderMenuDropdown({
  onToggleDarkMode,
  darkMode,
  onShowSettings,
  onShowHelp,
  onShowShortcuts,
  onTogglePerformanceMode,
  performanceMode
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="header-menu-dropdown" ref={menuRef} style={{ position: 'relative' }}>
      <button
        className="nav-btn"
        title="Menu"
        style={{ fontSize: 22, padding: '0.4em 0.7em' }}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        ☰
      </button>
      {open && (
        <div
          className="header-menu-dropdown-list"
          style={{
            position: 'absolute',
            right: 0,
            top: '110%',
            minWidth: 180,
            background: 'var(--card-bg, #fff)',
            color: 'var(--text-primary, #222)',
            border: '1px solid var(--border-color, #ddd)',
            borderRadius: 8,
            boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
            zIndex: 1000,
            padding: '0.5em 0',
            fontSize: 15
          }}
        >
          <button className="dropdown-item" style={itemStyle} onClick={() => { onTogglePerformanceMode(); setOpen(false); }}>
            {performanceMode ? '🎭 Keluar Performance Mode' : '🎭 Masuk Performance Mode'}
          </button>
          <button className="dropdown-item" style={itemStyle} onClick={() => { onToggleDarkMode(); setOpen(false); }}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button className="dropdown-item" style={itemStyle} onClick={() => { onShowSettings(); setOpen(false); }}>
            ⚙️ Pengaturan
          </button>
          <button className="dropdown-item" style={itemStyle} onClick={() => { onShowHelp(); setOpen(false); }}>
            ❓ Bantuan & Panduan
          </button>
          <button className="dropdown-item" style={itemStyle} onClick={() => { onShowShortcuts(); setOpen(false); }}>
            ⌨️ Keyboard Shortcuts
          </button>
        </div>
      )}
    </div>
  );
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  background: 'none',
  border: 'none',
  padding: '0.7em 1.2em',
  fontSize: 15,
  cursor: 'pointer',
  textAlign: 'left',
  gap: 10
};
