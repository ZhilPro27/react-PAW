// src/pages/EditProductPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/axiosInstance';
import { useNotification } from '../context/notificationContext';

// Impor komponen MUI
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ namaBarang: '', hargaBarang: '', stokBarang: '' });
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/barang/${id}`);
        const product = response.data;
        setFormData({
          namaBarang: product.namaBarang,
          hargaBarang: product.hargaBarang,
          stokBarang: product.stokBarang
        });
        setCurrentImage(product.gambar);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data produk.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('namaBarang', formData.namaBarang);
    data.append('hargaBarang', formData.hargaBarang);
    data.append('stokBarang', formData.stokBarang);
    if (file) {
      data.append('gambar', file);
    }

    try {
      const response = await api.put(`/barang/${id}`, data);
      setMessage(response.data.message);
      showNotification('Barang berhasil diperbarui!', 'success');
      setTimeout(() => navigate('/admin/products'), 1000);
    } catch (err) {
      setError('Gagal memperbarui barang.');
      showNotification('Gagal memperbarui barang.', 'error');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Barang
        </Typography>

        {currentImage && (
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">Gambar Saat Ini:</Typography>
            <Box
              component="img"
              src={`http://localhost:5000/uploads/${currentImage}`}
              alt="Gambar saat ini"
              sx={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 2, mt: 1 }}
            />
          </Box>
        )}
        
        <TextField label="Nama Barang" name="namaBarang" value={formData.namaBarang} onChange={handleTextChange} variant="outlined" required />
        <TextField label="Harga Barang (Rp)" name="hargaBarang" type="number" value={formData.hargaBarang} onChange={handleTextChange} variant="outlined" required />
        <TextField label="Stok Barang" name="stokBarang" type="number" value={formData.stokBarang} onChange={handleTextChange} variant="outlined" required />
        
        <Button variant="outlined" component="label">
          Upload Gambar Baru (Opsional)
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {file && <Typography variant="body2">{file.name}</Typography>}

        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
          Update Barang
        </Button>
      </Box>
    </Container>
  );
};

export default EditProductPage;