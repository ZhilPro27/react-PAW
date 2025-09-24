import React, { useState, useEffect } from 'react';
import api from '../services/axiosInstance';
import { 
  Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Box,
  List, ListItem, ListItemText, TableContainer
} from '@mui/material';
import { useNotification } from '../context/notificationContext';

const AdminPesananPage = () => {
  const [pesanan, setPesanan] = useState([]);
  const { showNotification } = useNotification();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedPesananDetails, setSelectedPesananDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchPesanan = async () => {
    try {
      const response = await api.get('/pesanan?status=pending');
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
      await api.put(`/pembelian/pesanan/${id}/status`, { status });
      fetchPesanan();
      const message = status === 'completed' ? 'Pesanan berhasil diterima.' : 'Pesanan berhasil ditolak.';
      showNotification(message, 'success');
    } catch (error) {
      showNotification('Gagal mengubah status pesanan.', 'error');
    }
  };

  const handleLihatDetail = async (idPembelian) => {
    setLoadingDetails(true);
    setOpenDetailDialog(true);
    try {
      const response = await api.get(`/detailPembelian/${idPembelian}`);
      setSelectedPesananDetails(response.data);
    } catch (error) {
      showNotification('Gagal memuat detail pesanan.', 'error');
      console.error("Gagal memuat detail:", error);
      setOpenDetailDialog(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedPesananDetails([]);
  };

  const totalPesanan = selectedPesananDetails.reduce(
            (sum, item) => sum + item.totalHargaBarang,
            0 // Nilai awal
  );

  const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Pesanan Masuk (Pending)</Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Pesanan</TableCell>
              <TableCell>Nama User</TableCell>
              <TableCell align="right">Total Harga</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pesanan.map(p => (
              <TableRow key={p.idPembelian}>
                <TableCell>{p.idPembelian}</TableCell>
                <TableCell>{p.namaUser || 'User Dihapus'}</TableCell>
                <TableCell align="right">{formatRupiah(p.totalHarga)}</TableCell>
                <TableCell align="center">
                  <Button variant="text" size="small" sx={{ mr: 1 }} onClick={() => handleLihatDetail(p.idPembelian)}>
                    Lihat Detail
                  </Button>
                  <Button variant="contained" color="success" size="small" sx={{ mr: 1 }} onClick={() => handleUpdateStatus(p.idPembelian, 'completed')}>
                    Terima
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleUpdateStatus(p.idPembelian, 'rejected')}>
                    Tolak
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} fullWidth maxWidth="sm">
        <DialogTitle>Detail Pesanan</DialogTitle>
        <DialogContent>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {selectedPesananDetails.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={item.namaBarang}
                    secondary={`Jumlah: ${item.jumlahBarang}`}
                  />
                  <Typography variant="body1">
                    {formatRupiah(item.totalHargaBarang)}
                  </Typography>
                </ListItem>
              ))}
              <ListItem>
                <ListItemText primary={<Typography variant="h6">Total</Typography>} />
                <Typography variant="h6" color="primary">
                  {formatRupiah(totalPesanan)}
                </Typography>
              </ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};


export default AdminPesananPage;