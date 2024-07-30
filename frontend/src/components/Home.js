// components/Home.js
import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <Typography variant="h4">Welcome to BookBuddy</Typography>
      <Button variant="contained" component={Link} to="/register">Sign Up</Button>
      <Button variant="contained" component={Link} to="/login">Login</Button>
    </div>
  );
};

export default Home;
