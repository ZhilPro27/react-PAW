import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNotification } from '../context/notificationContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ nama: '', email: '', password: '' });
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      showNotification('Registrasi berhasil! Silakan login.', 'success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      const message = error.response?.data?.message || 'Registrasi gagal.';
      showNotification(message, 'error');
    }
  };
  
  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>Daftar Akun Baru</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Nama Lengkap" name="nama" onChange={handleChange} required />
            <TextField label="Email" name="email" type="email" onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" onChange={handleChange} required />
            <Button type="submit" variant="contained" size="large">Daftar</Button>
            <Typography align="center" sx={{ mt: 2 }}>
                Sudah punya akun? <Link to="/login">Login di sini</Link>
            </Typography>
        </Box>
    </Container>
  );
};

export default RegisterPage;