import React, { useState, useEffect } from 'react';
import api from '../services/axiosInstance';
import { Container, Paper, Typography, Box, Avatar, CircularProgress } from '@mui/material';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
  }

  if (!user) {
    return <Typography sx={{ textAlign: 'center', mt: 5 }}>Gagal memuat profil pengguna.</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main' }}>
            {user.nama.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4" component="h1" gutterBottom>{user.nama}</Typography>
          <Typography variant="body1" color="text.secondary">{user.email}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            Bergabung sejak: {new Date(user.created_at).toLocaleDateString('id-ID')}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;