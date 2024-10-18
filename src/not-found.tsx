import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
  },
  errorText: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(4),
  },
  homeButton: {
    marginTop: theme.spacing(4),
  },
}));

const NotFound = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Container className={classes.container}>
      <Typography variant="h1" color="error" className={classes.errorText}>
        404
      </Typography>
      <Typography variant="h4">
        Désolé, la page que vous cherchez n'existe pas.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.homeButton}
        onClick={() => navigate('/search')}
      >
        Retour à l'accueil
      </Button>
    </Container>
  );
};

export default NotFound;