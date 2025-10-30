import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const SettingsContext = createContext(null);

export const DEFAULT_SETTINGS = {
  websiteName: 'Jesus Dela Peña',
  logoSrc: '/images/jdlp-logo.png',
  headerColor: '#022954',
  // Structured footer fields for consistent layout
  footerCopyright: '© 2025 Jesus Dela Peña Barangay Information System',
  footerEmail: 'brgy.jdlp@gmail.com',
  footerPhone: '(028) 243-9467',
  footerColor: '#022954',
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      const parsed = saved ? JSON.parse(saved) : null;

      // Backwards compatibility: migrate from legacy footerText if present
      if (parsed && parsed.footerText && (!parsed.footerCopyright || !parsed.footerEmail || !parsed.footerPhone)) {
        const lines = String(parsed.footerText).split('\n');
        const [copyrightLine = DEFAULT_SETTINGS.footerCopyright, emailLine = DEFAULT_SETTINGS.footerEmail, phoneLine = DEFAULT_SETTINGS.footerPhone] = lines;
        delete parsed.footerText; // remove legacy field to avoid confusion
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          footerCopyright: parsed.footerCopyright || copyrightLine,
          footerEmail: parsed.footerEmail || emailLine,
          footerPhone: parsed.footerPhone || phoneLine,
        };
      }

      return parsed ? { ...DEFAULT_SETTINGS, ...parsed } : DEFAULT_SETTINGS;
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


