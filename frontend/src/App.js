import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import ManageBooks from './pages/ManageBooks'; 
import ManageCollections from './pages/ManageCollections';  
import Profile from './components/profile';
import Navbar from './components/Navbar';
import Home from './components/Home';

import './App.css';

function App() {
  const [token, setToken] = useState('');

  const handleLogout = () => {
    setToken('');
    
  };

  return (
    <Router>
      <div className="App">
        <Navbar onLogout={handleLogout} />
        <Container>
          <Routes>
            <Route path="/profile" element={<Profile token={token} />} />
            <Route path="/manage-books" element={<ManageBooks token={token} />} />
            <Route path="/manage-collections" element={<ManageCollections token={token} />} />

            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
