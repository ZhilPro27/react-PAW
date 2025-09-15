import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { useNotification } from '../context/notificationContext';


import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    namaBarang: '',
    hargaBarang: '',
    stokBarang: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const data = new FormData();
    data.append('namaBarang', formData.namaBarang);
    data.append('hargaBarang', formData.hargaBarang);
    data.append('stokBarang', formData.stokBarang);
    if (file) {
      data.append('gambar', file);
    }

    try {
      const response = await api.post('/barang', data);
      
      setError(''); 
      setMessage(response.data.message || "Barang berhasil ditambahkan!");
      showNotification('Barang berhasil ditambahkan!', 'success');

      setFormData({ namaBarang: '', hargaBarang: '', stokBarang: '' });
      setFile(null);
      if(document.getElementById('file-input')) {
        document.getElementById('file-input').value = null;
      }
      
      setTimeout(() => navigate('/admin/products'), 2000);

    } catch (err) {
      setMessage('');
      setError(err.response?.data?.message || 'Gagal menambahkan barang. Periksa kembali data Anda.');
      showNotification('Gagal menambahkan barang.', 'error');
      console.error('Error adding product:', err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tambah Barang Baru
        </Typography>
        
        <TextField
          label="Nama Barang"
          name="namaBarang"
          value={formData.namaBarang}
          onChange={handleTextChange}
          variant="outlined"
          required
        />
        <TextField
          label="Harga Barang (Rp)"
          name="hargaBarang"
          type="number"
          value={formData.hargaBarang}
          onChange={handleTextChange}
          variant="outlined"
          required
        />
        <TextField
          label="Stok Barang"
          name="stokBarang"
          type="number"
          value={formData.stokBarang}
          onChange={handleTextChange}
          variant="outlined"
          required
        />
        
        <Button variant="outlined" component="label">
          Upload Gambar
          <input type="file" hidden onChange={handleFileChange} required />
        </Button>

        {file && <Typography variant="body2">{file.name}</Typography>}

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
          Simpan Barang
        </Button>
      </Box>
    </Container>
  );
};

export default AddProductPage;