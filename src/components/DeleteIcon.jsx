import React from 'react';
export default function DeleteIcon({ size = 18, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={style} xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="7.5" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 10v3M12 10v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="3" width="6" height="3" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}
