import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import List from '../../components/List/List';
import { Button, Typography } from '@mui/material';

const Home: React.FC = () => {
  return (
    <div>
      {/* <Typography variant="h4">Welcome to My App</Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button> */}
      <Header />
      {/* Home */}
      <List />
      <Footer />
    </div>
  );
};

export default Home;
