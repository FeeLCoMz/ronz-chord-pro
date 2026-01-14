import { useState } from 'react';

export const usePerformanceMode = () => {
  const [performanceMode, setPerformanceMode] = useState(false);
  const [performanceTheme, setPerformanceTheme] = useState('dark-stage');
  const [performanceFontSize, setPerformanceFontSize] = useState(100);
  const [showSetlistView, setShowSetlistView] = useState(true);

  const togglePerformanceMode = () => {
    setPerformanceMode(prev => !prev);
  };

  const cyclePerformanceTheme = () => {
    const themes = ['dark-stage', 'bright', 'amber', 'high-contrast'];
    const currentIdx = themes.indexOf(performanceTheme);
    setPerformanceTheme(themes[(currentIdx + 1) % themes.length]);
  };

  const increaseFontSize = () => {
    setPerformanceFontSize(prev => Math.min(150, prev + 10));
  };

  const decreaseFontSize = () => {
    setPerformanceFontSize(prev => Math.max(50, prev - 10));
  };

  const resetFontSize = () => {
    setPerformanceFontSize(100);
  };

  return {
    performanceMode,
    setPerformanceMode,
    performanceTheme,
    setPerformanceTheme,
    performanceFontSize,
    setPerformanceFontSize,
    showSetlistView,
    setShowSetlistView,
    togglePerformanceMode,
    cyclePerformanceTheme,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize
  };
};
