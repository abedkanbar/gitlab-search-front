import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, Typography, Switch } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from './authContext';
import { ThemeContext } from './themeContext';

const Menu = () => {
  const { user, logout } = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const navigate = useNavigate();

  if (!themeContext) {
    throw new Error("ThemeContext must be used within a ThemeProviderComponent");
  }

  const { mode, toggleColorMode } = themeContext;

  const handleLogout = () => {
    logout(() => navigate('/home'));
  };

  return (
    <Box sx={{ flexGrow: 1 }} color="text.secondary">
      <AppBar position="static">
        <Toolbar>
          {user ? (
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              <Button color="inherit" component={RouterLink} to="/">Home</Button>
              <Button color="inherit" component={RouterLink} to="/search">Search</Button>
              <Button color="inherit" component={RouterLink} to="/pipelines">Pipelines</Button>
            </Typography>
          ) : (
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              <Button color="inherit" component={RouterLink} to="/">Home</Button>
            </Typography>
          )}

          {user ? (
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Welcome {user.name}
            </Typography>
          ) : null}

          {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          )}

          <Switch checked={mode === 'dark'} onChange={toggleColorMode} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Menu;
