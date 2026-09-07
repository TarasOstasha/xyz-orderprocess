import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import List from '../../components/List/List';

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <List />
      <Footer />
    </div>
  );
};

export default Home;
