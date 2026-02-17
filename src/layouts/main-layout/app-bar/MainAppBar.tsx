import { AppBar, Box, Button, Toolbar } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import Logo from '../../../components/base/Logo';
import paths from '../../../routes/paths';

export default function MainAppBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(11,15,25,0.55)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Logo />

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Navigare actualizată */}
          <Button component={RouterLink} to={paths.home} color="inherit">
            Home
          </Button>

          <Button component={RouterLink} to={paths.findAPro} color="inherit">
            Find a pro
          </Button>

          <Button color="inherit">Become a pro</Button>

          <Button variant="contained" component={RouterLink} to={paths.home}>
            Sign in
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
