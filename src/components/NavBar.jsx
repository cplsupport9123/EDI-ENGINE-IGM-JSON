import React from "react";
import { AppBar, Toolbar, Link, Box, Button, useTheme } from "@mui/material";

export default function NavBar({ themeMode, setThemeMode }) {
  const theme = useTheme();
  // PWA install button logic (optional, remove if not needed)
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [showInstall, setShowInstall] = React.useState(false);

  React.useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstall(false);
      setDeferredPrompt(null);
    }
  };

  // Logo (update src as needed)
  const logo = (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
      <a href="https://igm-json.web.app/" style={{ display: 'inline-block' }}>
        <Box
          component="img"
          src="/logo.jpg"
          alt="Logo"
          sx={{
            width: 40,
            height: 40,
            objectFit: 'cover',
            boxShadow: theme.palette.mode === 'dark' ? 3 : 1,
            bgcolor: '#fff',
          }}
        />
      </a>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        zIndex: 1201,
        background: theme.palette.mode === 'dark' ? '#ED1C24' : theme.palette.primary.main,
        color: '#fff',
        borderBottom: theme.palette.mode === 'dark' ? '2px solid #fff' : '2px solid #ED1C24',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 3 },
          flexWrap: 'wrap',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {logo}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <Link href="https://igm-json.web.app/" color="inherit" underline="none" sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
            IGM  - JSON Converter
          </Link>
          <Link href="https://baplie-viewer.web.app/" color="inherit" underline="none" sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
            Bapalie
          </Link>
          <Link href="https://igm-viewer-generator.web.app/" color="inherit" underline="none" sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
            igm&lt;-&gt;Generator
          </Link>
        </Box>
        {showInstall && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Button
              onClick={handleInstallClick}
              variant="contained"
              color="inherit"
              sx={{
                bgcolor: '#fff',
                color: '#ED1C24',
                fontWeight: 700,
                boxShadow: 2,
                textTransform: 'none',
                px: 2,
                py: 1,
                minWidth: 0,
                ml: 1,
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
              startIcon={
                <img src="/install-icon.svg" alt="Install" style={{ width: 24, height: 24 }} />
              }
            >
              Install App
            </Button>
          </Box>
        )}
        <Box sx={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Link href="https://www.centuryports.com/" color="inherit" underline="none" target="_blank" rel="noopener" sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
            Century Ports
          </Link>
          {/* Dark/Light theme toggle */}
          <Button
            onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
            color="inherit"
            sx={{
              minWidth: 0,
              ml: 1,
              background: theme.palette.mode === 'dark' ? '#FFA500' : '#f0f0f0', // Orange for dark, light gray for light
              color: theme.palette.mode === 'dark' ? '#000' : '#000', // Black text
              borderRadius: '20px', // Pill shape
              padding: '8px 16px', // Adjust padding
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': {
                background: theme.palette.mode === 'dark' ? '#FFC04D' : '#e0e0e0',
              },
            }}
            aria-label="Toggle dark/light mode"
          >
            {themeMode === 'dark' ? '🌞 Light' : '🌜 Dark'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
