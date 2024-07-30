// components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          BookBuddy
        </Typography>
        <Button color="inherit" component={Link} to="/manage-books">Books</Button>
        <Button color="inherit" component={Link} to="/manage-collections">Collections</Button>
        <Button color="inherit" component={Link} to="/profile">Profile</Button>
        <Button color="inherit" onClick={onLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
