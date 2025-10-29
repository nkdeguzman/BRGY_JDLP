import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Divider, Stack } from '@mui/material';
import { useSettings, DEFAULT_SETTINGS } from '../context/SettingsContext.jsx';

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  const [websiteName, setWebsiteName] = useState(settings.websiteName || '');
  const [logoPreview, setLogoPreview] = useState(settings.logoSrc || '/images/jdlp-logo.png');
  const [headerColor, setHeaderColor] = useState(settings.headerColor || '#022954');
  const [footerText, setFooterText] = useState(settings.footerText || '');
  const [footerColor, setFooterColor] = useState(settings.footerColor || '#022954');

  // Sync form fields when settings change
  useEffect(() => {
    setWebsiteName(settings.websiteName || '');
    setLogoPreview(settings.logoSrc || '/images/jdlp-logo.png');
    setHeaderColor(settings.headerColor || '#022954');
    setFooterText(settings.footerText || '');
    setFooterColor(settings.footerColor || '#022954');
  }, [settings]);

  const handleLogoFile = async (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSettings({
      websiteName,
      logoSrc: logoPreview,
      headerColor,
      footerText,
      footerColor,
    });
  };

  const handleUndo = () => {
    // Revert form values to the last saved settings
    setWebsiteName(settings.websiteName || '');
    setLogoPreview(settings.logoSrc || '/images/jdlp-logo.png');
    setHeaderColor(settings.headerColor || '#022954');
    setFooterText(settings.footerText || '');
    setFooterColor(settings.footerColor || '#022954');
  };

  const handleResetDefaults = () => {
    setWebsiteName(DEFAULT_SETTINGS.websiteName);
    setLogoPreview(DEFAULT_SETTINGS.logoSrc);
    setHeaderColor(DEFAULT_SETTINGS.headerColor);
    setFooterText(DEFAULT_SETTINGS.footerText);
    setFooterColor(DEFAULT_SETTINGS.footerColor);
    setSettings({ ...DEFAULT_SETTINGS });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 3, border: '1px solid #022954', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ color: '#022954', fontWeight: 'bold', mb: 2 , fontWeight: 'bold'}}>
          Settings
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', color: '#022954' , fontWeight: 'bold' }}>
            Website Name
          </Typography>
          <TextField
            fullWidth
            size="small"
            value={websiteName}
            onChange={(e) => setWebsiteName(e.target.value)}
            sx={{ backgroundColor: '#f1f1f1' }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#022954', mb: 0.5 , fontWeight: 'bold'}}>
              Logo
            </Typography>
            <input type="file" accept="image/*" onChange={(e) => handleLogoFile(e.target.files?.[0] || null)} />
            <Box sx={{ mt: 1 }}>
              <img src={logoPreview} alt="logo preview" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }} />
            </Box>
          </Box>
        </Stack>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#022954', mb: 0.5 , fontWeight: 'bold'}}>
            Header Color
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flexGrow: 1, height: 8, backgroundColor: headerColor, borderRadius: 1, border: '1px solid #ccc' }} />
            <input type="color" value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#022954', mb: 0.5 , fontWeight: 'bold' , fontWeight: 'bold'}}>
            Footer Text
          </Typography>
          <TextField
            fullWidth
            size="small"
            multiline
            minRows={3}
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            sx={{ backgroundColor: '#f1f1f1' }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#022954', mb: 0.5 , fontWeight: 'bold' , fontWeight: 'bold'}}>
            Footer Color
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ flexGrow: 1, height: 8, backgroundColor: footerColor, borderRadius: 1, border: '1px solid #ccc' }} />
            <input type="color" value={footerColor} onChange={(e) => setFooterColor(e.target.value)} />
          </Box>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#022954' }}>
            Save Settings
          </Button>
          <Button variant="outlined" onClick={handleResetDefaults}>
            Reset to Defaults
          </Button>
        </Stack>
      </Paper>

      
    </Box>
  );
}


