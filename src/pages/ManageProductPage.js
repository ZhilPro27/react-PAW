import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/axiosInstance";
import { useNotification } from "../context/notificationContext";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  IconButton,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ManageProductsPage = () => {
  const [barang, setBarang] = useState([]);
  const [setError] = useState("");
  const { showNotification } = useNotification();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await api.get("/barang");
        setBarang(response.data);
      } catch (err) {
        console.error("Gagal memuat produk:", err);
        setError("Gagal memuat data produk.");
      }
    };
    fetchBarang();
  }, [setError]);

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
      await api.delete(`/barang/${selectedId}`);
      showNotification("Barang berhasil dihapus.", "success");
      setBarang(barang.filter((b) => b.idBarang !== selectedId));
    } catch (error) {
      showNotification("Gagal menghapus barang.", "error");
      console.error("Gagal menghapus:", error);
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1">
          Manajemen Produk
        </Typography>
        <Button variant="contained" component={Link} to="/admin/add-product">
          + Tambah Produk
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Gambar</TableCell>
              <TableCell>Nama Barang</TableCell>
              <TableCell align="right">Harga</TableCell>
              <TableCell align="center">Stok</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {barang.map((item) => (
              <TableRow key={item.idBarang}>
                <TableCell>
                  <Box
                    component="img"
                    src={`http://localhost:5000/uploads/${item.gambar}`}
                    alt={item.namaBarang}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
                <TableCell>{item.namaBarang}</TableCell>
                <TableCell align="right">
                  Rp {item.hargaBarang.toLocaleString("id-ID")}
                </TableCell>
                <TableCell align="center">{item.stokBarang}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    component={Link}
                    to={`/admin/edit-product/${item.idBarang}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleClickOpenDialog(item.idBarang)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Konfirmasi Hapus Barang"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Apakah Anda yakin ingin menghapus barang ini secara permanen? Aksi
            ini tidak dapat dibatalkan.
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

export default ManageProductsPage;
