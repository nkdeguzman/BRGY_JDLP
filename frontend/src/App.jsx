import React from 'react';
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Container,
  Divider,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PeopleIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReportIcon from '@mui/icons-material/Report';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LogoutIcon from '@mui/icons-material/Logout'; // Import logout icon

// ✅ Import your pages
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResidentsPage from './pages/ResidentsPage';
import HouseholdsPage from './pages/HouseholdsPage';
import IncidentsPage from './pages/IncidentsPage';
import DocumentsPage from './pages/DocumentsPage';
import CertificatePage from './pages/CertificatePage';
import SettingsPage from './pages/SettingsPage';
import { useSettings } from './context/SettingsContext.jsx';

export default function App() {
  const { settings } = useSettings();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [navExpanded, setNavExpanded] = React.useState(false);
  const [navLocked, setNavLocked] = React.useState(false);
  const location = useLocation(); // for active highlight
  const navigate = useNavigate(); // for navigation
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const handleNavHover = (expanded) => {
    if (!navLocked) {
      setNavExpanded(expanded);
    }
  };

  const toggleNavLock = () => {
    setNavLocked(!navLocked);
    if (!navLocked) {
      setNavExpanded(true);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Add any logout logic here (clear tokens, etc.)
    // Then navigate to login page
    navigate('/login');
  };

  const menuItems = [
    { text: 'Home', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Residents', icon: <PeopleIcon />, path: '/residents' },
    { text: 'Households', icon: <HomeIcon />, path: '/households' },
    { text: 'Incidents', icon: <ReportIcon />, path: '/incidents' },
    { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
    { text: 'Certificate', icon: <AssignmentIcon />, path: '/certificate' },
  ];

  // Render landing page and login page without header/sidebar
  if (isLandingPage || isLoginPage) {
    return (
      <Box sx={{ height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Box>
    );
  }

  // Render other pages with header/sidebar
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* HEADER */}
      <AppBar
        position="fixed"
        sx={{ backgroundColor: settings.headerColor, zIndex: 1201 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <img
                src={settings.logoSrc || '/images/jdlp-logo.png'}
                alt="JDLP Logo"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.2 }}
              >
                {settings.websiteName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'white', fontSize: '0.9rem' }}
              >
                Barangay Information System
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />

      {/* MAIN CONTENT WITH NAVIGATION */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden',
        }}
      >
        {/* COLLAPSIBLE NAVIGATION SIDEBAR */}
        <Box
          sx={{
            position: 'relative',
            width: navExpanded || navLocked ? '200px' : '70px',
            backgroundColor: '#b0c9e3',
            color: '#022954',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            flexShrink: 0,
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
          onMouseEnter={() => handleNavHover(true)}
          onMouseLeave={() => handleNavHover(false)}
        >
          {/* Lock Button */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <IconButton
              onClick={toggleNavLock}
              sx={{
                backgroundColor: navLocked ? '#022954' : 'rgba(2, 41, 84, 0.1)',
                color: navLocked ? 'white' : '#022954',
                width: 30,
                height: 30,
                '&:hover': {
                  backgroundColor: navLocked
                    ? '#1a3d6b'
                    : 'rgba(2, 41, 84, 0.2)',
                },
              }}
            >
              {navLocked ? (
                <LockIcon sx={{ fontSize: 16 }} />
              ) : (
                <LockOpenIcon sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Box>

          {/* Admin Panel Section */}
          <Box sx={{ p: 1, textAlign: 'center', pt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <PeopleIcon sx={{ color: '#022954', fontSize: 30 }} />
            </Box>
            {(navExpanded || navLocked) && (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#022954',
                    fontSize: '20px',
                  }}
                >
                  JDLP
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#022954', fontSize: '10px' }}
                >
                  Admin Panel
                </Typography>
              </>
            )}
          </Box>

          {(navExpanded || navLocked) && <Divider sx={{ mx: 2 }} />}

          {/* Menu Items */}
          <List sx={{ px: 1.5, py: 1, flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => {
                  if (!navLocked) {
                    setDrawerOpen(false);
                  }
                }}
                sx={{
                  color: '#022954',
                  borderRadius: '10px',
                  mb: 0.5,
                  backgroundColor:
                    location.pathname === item.path ? '#ffffff' : 'transparent',
                  '&:hover': { backgroundColor: '#ffffff' },
                  py: 0.75,
                  px: 1.5,
                  justifyContent:
                    navExpanded || navLocked ? 'flex-start' : 'center',
                  minHeight: 36,
                  width:
                    navExpanded || navLocked ? 'calc(100% - 16px)' : 'auto',
                  mx: navExpanded || navLocked ? 1 : 0,
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#022954',
                    minWidth: navExpanded || navLocked ? 32 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {React.cloneElement(item.icon, { sx: { fontSize: 20 } })}
                </ListItemIcon>
                {(navExpanded || navLocked) && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight:
                        location.pathname === item.path ? 'bold' : 'normal',
                      fontSize: '0.75rem',
                    }}
                  />
                )}
              </ListItemButton>
            ))}
          </List>

          {/* Logout Button - Fixed at bottom */}
          <Box sx={{ mt: 'auto', pb: 2 }}>
            <Divider sx={{ mx: 2, mb: 1 }} />
            <ListItemButton
              onClick={handleLogout}
              sx={{
                color: '#022954',
                borderRadius: '10px',
                mb: 1,
                backgroundColor: 'transparent',
                '&:hover': { backgroundColor: '#ffffff' },
                py: 0.75,
                px: 1.5,
                justifyContent:
                  navExpanded || navLocked ? 'flex-start' : 'center',
                minHeight: 36,
                width: navExpanded || navLocked ? 'calc(100% - 16px)' : 'auto',
                mx: navExpanded || navLocked ? 1 : 0,
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#022954',
                  minWidth: navExpanded || navLocked ? 32 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {(navExpanded || navLocked) && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </ListItemButton>

            {/* Settings Button below Logout */}
            <ListItemButton
              component={Link}
              to="/settings"
              onClick={() => {
                if (!navLocked) {
                  setDrawerOpen(false);
                }
              }}
              sx={{
                color: '#022954',
                borderRadius: '10px',
                mb: 6,
                backgroundColor:
                  location.pathname === '/settings' ? '#ffffff' : 'transparent',
                '&:hover': { backgroundColor: '#ffffff' },
                py: 0.75,
                px: 1.5,
                justifyContent:
                  navExpanded || navLocked ? 'flex-start' : 'center',
                minHeight: 36,
                width:
                  navExpanded || navLocked ? 'calc(100% - 16px)' : 'auto',
                mx: navExpanded || navLocked ? 1 : 0,
              }}
            >
              <ListItemIcon
                sx={{
                  color: '#022954',
                  minWidth: navExpanded || navLocked ? 32 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LockIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {(navExpanded || navLocked) && (
                <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{ fontSize: '0.75rem' }}
                />
              )}
            </ListItemButton>
          </Box>
        </Box>

        {/* CONTENT AREA */}
        <Box
          sx={{
            flexGrow: 1,
            p: 1,
            pb: 10,
            backgroundColor: 'white',
            overflow: 'auto',
          }}
        >
          <Container>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/residents" element={<ResidentsPage />} />
              <Route path="/households" element={<HouseholdsPage />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/certificate" element={<CertificatePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Container>
        </Box>
      </Box>

      {/* FOOTER */}
      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: settings.footerColor,
          color: 'white',
          py: 2,
          px: 3,
          zIndex: 1000,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Left: Copyright */}
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {settings.footerCopyright}
            </Typography>

            {/* Right: Contact */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: { xs: 1, sm: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon sx={{ fontSize: 16, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {settings.footerEmail}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon sx={{ fontSize: 16, opacity: 0.9 }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {settings.footerPhone}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
