import React, { useState, useEffect } from "react";
import api from "../services/axiosInstance";
import { useCart } from "../context/CartContext";

import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";

const KatalogPage = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const response = await api.get("/barang");
        setBarang(response.data);
      } catch (err) {
        console.error("Gagal memuat katalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarang();
  }, []);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Katalog Produk Kami
      </Typography>
      <Grid container spacing={4}>
        {barang.map((item) => (
          <Grid item key={item.idBarang} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                ...(item.stokBarang === 0 && {
                  filter: "grayscale(100%)",
                  opacity: 0.6,
                  backgroundColor: "#fafafa",
                }),
              }}
            >
              <CardMedia
                component="img"
                sx={{ height: 200 }}
                image={`http://localhost:5000/uploads/${item.gambar}`}
                alt={item.namaBarang}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {item.namaBarang}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Stok: {item.stokBarang > 0 ? item.stokBarang : "Habis"}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  {formatRupiah(item.hargaBarang)}
                </Typography>
                <Button onClick={() => addToCart(item)}>
                  Tambah ke Keranjang
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default KatalogPage;
