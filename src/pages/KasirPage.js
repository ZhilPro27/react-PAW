import React, { useState, useEffect } from "react";
import api from "../services/axiosInstance";
import { useNotification } from "../context/notificationContext";

import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const KasirPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await api.get("/barang");
        const historyRes = await api.get("/pembelian");
        setProducts(productRes.data);
        setHistory(historyRes.data);
      } catch (error) {
        showNotification("Gagal memuat data.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showNotification]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.idBarang === product.idBarang
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.idBarang === product.idBarang
            ? { ...item, jumlahBarang: item.jumlahBarang + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, jumlahBarang: 1 }];
    });
  };

  const handleClickOpenDialog = (id) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    try {
      await api.delete(`/pembelian/${selectedId}`);
      showNotification("Transaksi berhasil dihapus.", "success");

      setHistory(history.filter((p) => p.idPembelian !== selectedId));

      const productRes = await api.get("/barang");

      const newProducts = productRes.data.data || productRes.data;
      setProducts(newProducts);
    } catch (error) {
      showNotification("Gagal menghapus transaksi.", "error");
      console.error("Gagal menghapus transaksi:", error);
    } finally {
      handleCloseDialog();
    }
  };

  const removeFromCart = (idBarang) => {
    setCart(cart.filter((item) => item.idBarang !== idBarang));
  };

  const totalHargaKeranjang = cart.reduce((total, item) => {
    return total + item.hargaBarang * item.jumlahBarang;
  }, 0);

  const handleSaveTransaction = async () => {
    if (cart.length === 0) {
      showNotification(
        "Keranjang kosong. Tambahkan produk sebelum menyimpan transaksi.",
        "warning"
      );
      return;
    }

    const transactionData = {
      totalHarga: totalHargaKeranjang,
      items: cart.map((item) => ({
        idBarang: item.idBarang,
        jumlahBarang: item.jumlahBarang,
        totalHargaBarang: item.hargaBarang * item.jumlahBarang,
      })),
    };

    try {
      await api.post("/pembelian", transactionData);

      showNotification("Transaksi berhasil disimpan!", "success");

      const updatedProducts = [...products];

      cart.forEach((cartItem) => {
        const productIndex = updatedProducts.findIndex(
          (p) => p.idBarang === cartItem.idBarang
        );
        if (productIndex !== -1) {
          updatedProducts[productIndex].stokBarang -= cartItem.jumlahBarang;
        }
      });

      setProducts(updatedProducts);

      const historyRes = await api.get("/pembelian");

      setHistory(historyRes.data);
      setCart([]);
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
      showNotification("Gagal menyimpan transaksi.", "error");
    }
  };

  if (loading)
    return <Typography sx={{ p: 4 }}>Memuat Halaman Kasir...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kasir Pembelian
      </Typography>

      <Grid container spacing={3}>
        {/* KOLOM KIRI: DAFTAR PRODUK */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: "75vh", overflowY: "auto" }}>
            <Grid container spacing={2}>
              {products.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.idBarang}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      ...(p.stokBarang === 0 && {
                        filter: "grayscale(100%)",
                        opacity: 0.6,
                      }),
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="120"
                      image={`http://localhost:5000/uploads/${p.gambar}`}
                      alt={p.namaBarang}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" component="div" noWrap>
                        <strong>{p.namaBarang}</strong>
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {formatRupiah(p.hargaBarang)}
                      </Typography>
                      <Typography variant="caption">
                        Stok: {p.stokBarang}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => addToCart(p)}
                        disabled={p.stokBarang === 0}
                        fullWidth
                      >
                        + Tambah
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* KOLOM KANAN: KERANJANG & TOTAL */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, position: "sticky", top: "2rem" }}>
            <Typography variant="h5" gutterBottom>
              Transaksi Saat Ini
            </Typography>
            <List sx={{ minHeight: "40vh" }}>
              {cart.length === 0 ? (
                <Typography>Keranjang kosong</Typography>
              ) : (
                cart.map((item) => (
                  <ListItem
                    key={item.idBarang}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeFromCart(item.idBarang)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.namaBarang}
                      secondary={`x ${item.jumlahBarang}`}
                    />
                    <Typography>
                      {formatRupiah(item.hargaBarang * item.jumlahBarang)}
                    </Typography>
                  </ListItem>
                ))
              )}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h5" color="primary">
                {formatRupiah(totalHargaKeranjang)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={handleSaveTransaction}
            >
              Simpan Transaksi
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ marginTop: "3rem" }}>
        <Typography variant="h5" sx={{ p: 2 }}>
          Riwayat Transaksi
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Pembelian</TableCell>
                <TableCell>Waktu</TableCell>
                <TableCell align="right">Total Harga</TableCell>
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.idPembelian}>
                  <TableCell>{h.idPembelian}</TableCell>
                  <TableCell>{h.waktuTransaksi}</TableCell>
                  <TableCell align="right">
                    {formatRupiah(h.totalHarga)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleClickOpenDialog(h.idPembelian)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Konfirmasi Hapus Transaksi"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus transaksi ini? Stok barang akan
            dikembalikan. Aksi ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Ya, Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default KasirPage;
