import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ThemeContext = createContext();

const THEMES = {
  dark: {
    name: 'dark',
    colors: {
      primary: '#1e88e5',
      secondary: '#26c6da',
      success: '#66bb6a',
      danger: '#ef5350',
      warning: '#ffa726',
      info: '#42a5f5',
      background: '#1a1a1a',
      surface: '#2a2a2a',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#3a3a3a',
    },
  },
  light: {
    name: 'light',
    colors: {
      primary: '#1976d2',
      secondary: '#0097a7',
      success: '#388e3c',
      danger: '#d32f2f',
      warning: '#f57c00',
      info: '#1976d2',
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#212121',
      textSecondary: '#757575',
      border: '#e0e0e0',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    theme: THEMES[theme],
    themeName: theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};