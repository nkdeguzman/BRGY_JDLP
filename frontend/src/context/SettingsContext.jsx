import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

export const DEFAULT_SETTINGS = {
  websiteName: 'Jesus Dela Peña',
  logoSrc: '/images/jdlp-logo.png',
  headerColor: '#022954',
  footerText: '© 2025 Jesus Dela Peña Barangay Information System\nbrgy.jdlp@gmail.com\n(028) 243-9467',
  footerColor: '#022954',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const value = useMemo(() => ({ settings, setSettings }), [settings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}


