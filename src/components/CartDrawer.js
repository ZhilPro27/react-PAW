import React from 'react';
import { useCart } from '../context/CartContext';
import { useNotification } from '../context/notificationContext';
import api from '../services/axiosInstance';
import { Drawer, Box, Typography, List, ListItem, ListItemText, IconButton, Button, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

const CartDrawer = ({ open, onClose, auth }) => {
  const { cartItems, cartTotalPrice, removeFromCart, clearCart } = useCart();
  const { showNotification } = useNotification();

  const handleCheckout = async () => {
    if (!auth.isLoggedIn || auth.role !== 'user') {
      showNotification('Anda harus login sebagai user untuk checkout.', 'error');
      return;
    }

    const pesananData = {
      totalHarga: cartTotalPrice,
      items: cartItems.map(item => ({
        idBarang: item.idBarang,
        jumlahBarang: item.quantity,
        totalHargaBarang: item.hargaBarang * item.quantity,
      })),
    };

    try {
      const response = await api.post('/pembelian/pesanan', pesananData);
      showNotification(response.data.message || 'Checkout berhasil!', 'success');
      clearCart(); 
      onClose(); 
    } catch (error) {
      const message = error.response?.data?.message || 'Checkout gagal.';
      showNotification(message, 'error');
    }
  };

  return (
    // <Drawer> adalah komponen panel samping dari MUI
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }} role="presentation">
        <Typography variant="h5" sx={{ mb: 2 }}>Keranjang Anda</Typography>
        <Divider />
        
        {cartItems.length === 0 ? (
          <Typography sx={{ mt: 2 }}>Keranjang Anda masih kosong.</Typography>
        ) : (
          <List>
            {cartItems.map(item => (
              <ListItem
                key={item.idBarang}
                divider
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeFromCart(item.idBarang)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item.namaBarang}
                  secondary={`${item.quantity} x ${formatRupiah(item.hargaBarang)}`}
                />
                <Typography variant="body2">
                  {formatRupiah(item.hargaBarang * item.quantity)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}

        {cartItems.length > 0 && (
          <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #ddd' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">{formatRupiah(cartTotalPrice)}</Typography>
            </Box>
            <Button 
              variant="contained" 
              color="success" 
              fullWidth 
              onClick={handleCheckout}
            >
              Checkout Sekarang
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer;