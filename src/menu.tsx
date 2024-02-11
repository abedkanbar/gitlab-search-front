import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box } from '@material-ui/core';
import { Typography } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from './authContext';

const Menu = () => {  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(() => navigate('/home'));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>        
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/search">Search</Button>
        </Typography>

        {user ? (
          <Typography variant="h6" style={{ flexGrow: 1 }}>
              Welcome {user.name}
          </Typography>
        ): null}

        {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : (
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
          )}
      </Toolbar>
    </AppBar>
    </Box>
  );
};

export default Menu;