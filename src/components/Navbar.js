import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import { useCart } from '../context/CartContext'; 
import CartDrawer from './CartDrawer';

const Navbar = ({ auth, onLogout }) => {
  const navigate = useNavigate();
  const { cartTotalItems } = useCart(); 
  const [cartOpen, setCartOpen] = useState(false); 


  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none' }}>
          Katalog Online
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        
        {!auth.isLoggedIn ? (
          <>
          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
                <Badge badgeContent={cartTotalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </>
        ) : auth.role === 'admin' ? (
          <>
            <Button color="inherit" component={Link} to="/admin/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/admin/products">Kelola Produk</Button>
            <Button color="inherit" component={Link} to="/admin/pesanan">Pesanan</Button>
            <Button color="inherit" component={Link} to="/admin/kasir">Kasir</Button>
            <Button color="inherit" component={Link} to="/admin/log">Log</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Typography sx={{ mr: 2 }}>
              Halo, {auth.user?.nama || auth.user?.email}!
            </Typography>
            <Button color="inherit" component={Link} to="/">Katalog</Button>
            <Button color="inherit" component={Link} to="/profile">Profil Saya</Button>
            <IconButton color="inherit" onClick={() => setCartOpen(true)}>
                <Badge badgeContent={cartTotalItems} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} auth={auth} />
    </>
  );
};
export default Navbar;