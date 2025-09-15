import React, { useState, useEffect } from 'react';
import api from '../services/axiosInstance';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, TableContainer } from '@mui/material';

const AdminPesananPage = () => {
  const [pesanan, setPesanan] = useState([]);

  const fetchPesanan = async () => {
    try {
      const response = await api.get('/pembelian/pesanan?status=pending');
      console.log('Data diterima dari API:', response.data); 
      setPesanan(response.data);
      console.log('Memuat ulang data pesanan...'); 
    } catch (error) {
      console.error("Gagal memuat pesanan:", error);
    }
  };

  useEffect(() => {

    fetchPesanan();

    const intervalId = setInterval(() => {
      fetchPesanan();
    }, 15000);

    return () => clearInterval(intervalId);
  }, []); 

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/pembelian/${id}/status`, { status });
      fetchPesanan();
      alert(`Pesanan #${id} berhasil diubah menjadi ${status}`);
    } catch (error) {
      alert('Gagal mengubah status pesanan.');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Pesanan Masuk (Pending)</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Pesanan</TableCell>
              <TableCell>Nama User</TableCell>
              <TableCell>Total Harga</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pesanan.map(p => (
              <TableRow key={p.idPembelian}>
                <TableCell>{p.idPembelian}</TableCell>
                <TableCell>{p.namaUser}</TableCell>
                <TableCell>{/* formatRupiah(p.totalHarga) */}</TableCell>
                <TableCell>
                  <Button variant="contained" color="success" onClick={() => handleUpdateStatus(p.idPembelian, 'completed')}>Terima</Button>
                  <Button variant="contained" color="error" sx={{ ml: 1 }} onClick={() => handleUpdateStatus(p.idPembelian, 'rejected')}>Tolak</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminPesananPage;