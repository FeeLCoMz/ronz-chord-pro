import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  onSearchFocus,
  onNextSong,
  onPrevSong,
  onToggleTranspose,
  onTogglePerformanceMode,
  onShowHelp,
  onToggleLyricsMode,
  onToggleYouTube,
  onToggleAutoScroll
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input
      const activeElement = document.activeElement;
      const isInputFocused = 
        activeElement?.tagName === 'INPUT' || 
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.contentEditable === 'true';

      // Ctrl/Cmd + F → Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (onSearchFocus) onSearchFocus();
      }

      // Arrow Right → Next song
      if (e.key === 'ArrowRight' && !isInputFocused) {
        e.preventDefault();
        if (onNextSong) onNextSong();
      }

      // Arrow Left → Previous song
      if (e.key === 'ArrowLeft' && !isInputFocused) {
        e.preventDefault();
        if (onPrevSong) onPrevSong();
      }

      // T → Toggle transpose mode
      if (e.key === 't' && !isInputFocused) {
        e.preventDefault();
        if (onToggleTranspose) onToggleTranspose();
      }

      // P → Toggle performance mode (Shift + P)
      if (e.key === 'P' && e.shiftKey && !isInputFocused) {
        e.preventDefault();
        if (onTogglePerformanceMode) onTogglePerformanceMode();
      }

      // ? → Show keyboard help
      if (e.key === '?' && !isInputFocused) {
        e.preventDefault();
        if (onShowHelp) onShowHelp();
      }

      // M → Toggle lyrics mode
      if (e.key === 'm' && !isInputFocused) {
        e.preventDefault();
        if (onToggleLyricsMode) onToggleLyricsMode();
      }

      // Y → Toggle YouTube viewer
      if (e.key === 'y' && !isInputFocused) {
        e.preventDefault();
        if (onToggleYouTube) onToggleYouTube();
      }

      // A → Toggle auto-scroll
      if (e.key === 'a' && !isInputFocused) {
        e.preventDefault();
        if (onToggleAutoScroll) onToggleAutoScroll();
      }

      // Escape → Close modals (handled by modal components)
      if (e.key === 'Escape') {
        // This will be handled by individual modal components
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onSearchFocus,
    onNextSong,
    onPrevSong,
    onToggleTranspose,
    onTogglePerformanceMode,
    onShowHelp,
    onToggleLyricsMode,
    onToggleYouTube,
    onToggleAutoScroll
  ]);

  // Return keyboard shortcuts info
  return {
    shortcuts: [
      { keys: 'Ctrl/Cmd + F', action: 'Focus search bar' },
      { keys: '→', action: 'Next song' },
      { keys: '←', action: 'Previous song' },
      { keys: 'T', action: 'Toggle transpose mode' },
      { keys: 'Shift + P', action: 'Toggle performance mode' },
      { keys: 'M', action: 'Toggle lyrics mode' },
      { keys: 'Y', action: 'Toggle YouTube viewer' },
      { keys: 'A', action: 'Toggle auto-scroll' },
      { keys: '?', action: 'Show this help' },
      { keys: 'Esc', action: 'Close modals' }
    ]
  };
};
