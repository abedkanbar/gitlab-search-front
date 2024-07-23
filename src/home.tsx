import React from 'react';
import { Container, Typography, Grow, Box } from '@mui/material';
import './index.css';

const Home = () => {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <Box display="flex" height="50vh" alignItems="center" justifyContent="center" position="relative">
      <div className="star" style={{ top: '15%', left: '5%', transform: 'translate(-30%, -30%) rotate(45deg)' }}>★</div>
      <div className="star" style={{ top: '15%', right: '5%', transform: 'translate(30%, -30%) rotate(45deg)' }}>★</div>
      <div className="star" style={{ top: '15%', right: '50%', transform: 'translate(30%, -30%) rotate(45deg)' }}>★</div>
      <div className="star" style={{ bottom: '20%', left: '5%', transform: 'translate(-30%, 30%) rotate(45deg)' }}>★</div>
      <div className="star" style={{ bottom: '20%', left: '50%', transform: 'translate(-30%, 30%) rotate(45deg)' }}>★</div>
      <div className="star" style={{ bottom: '20%', right: '5%', transform: 'translate(30%, 30%) rotate(45deg)' }}>★</div>
      <Container>
        <Grow in={checked}>
          <Typography variant="h3" component="h1" gutterBottom align="center" className="rotate">
            Bienvenue sur Sterne GitLab, votre outil de gestion de projet GitLab tout-en-un.
          </Typography>
        </Grow>
      </Container>
    </Box>
  );
};

export default Home;