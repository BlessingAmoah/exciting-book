import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Avatar, Typography, Container, Grid } from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

  useEffect(() => {
    // Fetch user profile when component mounts
    axios.get('http://localhost:5002/api/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile:', error);
      });
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser(prevState => ({ ...prevState, profilePicture: URL.createObjectURL(file) }));
    }
  };

  const handleSave = () => {
    axios.put('/api/profile', user, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        setUser(response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setErrors(error.response?.data || {});
      });
  };

  return (
    <Container>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <Avatar
            src={user.profilePicture}
            alt="Profile Picture"
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          {isEditing && (
            <Button
              variant="contained"
              component="label"
            >
              Upload Picture
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
          )}
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h4">Profile</Typography>
          <TextField
            label="Name"
            name="name"
            value={user.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            name="email"
            value={user.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Bio"
            name="bio"
            value={user.bio}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            disabled={!isEditing}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsEditing(!isEditing)}
            sx={{ mt: 2 }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              sx={{ mt: 2, ml: 2 }}
            >
              Save
            </Button>
          )}
          {errors && <Typography color="error">{errors.message}</Typography>}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
