import React, { useState, useEffect } from "react";
import api from "../services/axiosInstance";

import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@mui/material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import StarIcon from "@mui/icons-material/Star";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const AdminDashboardPage = () => {
  const [laporan, setLaporan] = useState(null);
  const [barangTerlaris, setBarangTerlaris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const [resRingkasan, resBarangTerlaris] = await Promise.all([
          api.get("/ringkasan"),
          api.get("/barang-terlaris"),
        ]);
        setLaporan(resRingkasan.data);
        setBarangTerlaris(resBarangTerlaris.data);
      } catch (error) {
        console.error("Gagal memuat laporan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);

  if (loading)
    return <Typography sx={{ p: 4 }}>Memuat data laporan...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Admin
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        href="http://localhost:5000/api/penjualan-pdf"
        target="_blank"
        startIcon={<PictureAsPdfIcon />}
        sx={{ ml: 2 }}
      >
        Download Laporan Lengkap
      </Button>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <MonetizationOnIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">Total Pemasukan</Typography>
              <Typography component="p" variant="h5">
                {formatRupiah(laporan?.totalPemasukan)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">Jumlah Transaksi</Typography>
              <Typography component="p" variant="h5">
                {laporan?.jumlahTransaksi}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <InventoryIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography color="text.secondary">
                Total Barang Terjual
              </Typography>
              <Typography component="p" variant="h5">
                {laporan?.totalBarangTerjual} pcs
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          🏆 Barang Terlaris
        </Typography>
        <List>
          {barangTerlaris.map((barang, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                <StarIcon color={index < 3 ? "warning" : "inherit"} />
              </ListItemIcon>
              <ListItemText
                primary={barang.namaBarang}
                secondary={`Terjual: ${barang.totalTerjual}`}
              />
            </ListItem>
          ))}
          {barangTerlaris.length === 0 && (
            <Typography sx={{ p: 2 }}>Belum ada data penjualan.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default AdminDashboardPage;
