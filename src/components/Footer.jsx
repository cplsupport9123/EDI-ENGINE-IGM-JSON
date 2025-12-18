import React from "react";
import { Box, Container, Grid, Stack, Typography, Button, useTheme } from "@mui/material";

export default function Footer({ setHelpOpen }) {
  const theme = useTheme();
  return (
    <Box sx={{
      width: '100%',
      mt: 4,
      py: 3,
      borderTop: `1px solid ${theme.palette.divider}`,
      background: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#f9f9f9',
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="space-between" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.primary">
              <strong>Developed by Debasish Debnath (3015)</strong><br />
              For Port Operations
            </Typography>
          </Grid>
          <Grid item xs={12} sm="auto">
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setHelpOpen && setHelpOpen(true)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                How to Use
              </Button>
              <Button
                variant="contained"
                color="primary"
                component="a"
                href="mailto:support@centuryports.com?subject=IGM%20Viewer%20Support"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Support
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Box mt={2} textAlign="center">
          <Typography variant="caption" color="#ED1C24">
            © {new Date().getFullYear()} Debasish Debnath (3015). All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
