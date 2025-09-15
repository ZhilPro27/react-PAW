import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Box, CircularProgress } from '@mui/material';
import api from './services/axiosInstance';

import { NotificationProvider } from './context/notificationContext';
import { CartProvider } from './context/CartContext';

import Navbar from "./components/Navbar";

import KatalogPage from "./pages/KatalogPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ManageProductsPage from "./pages/ManageProductPage";
import AddProductPage from "./pages/AddProductPage";
import EditProductPage from "./pages/EditProductPage";
import KasirPage from "./pages/KasirPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import AuthRoute from './components/AuthRoute';
import ProfilePage from './pages/ProfilePage';
import AdminPesananPage from "./pages/AdminPesananPage";
import LogPage from "./pages/LogPage";

function App() {
  const [auth, setAuth] = useState({
    isLoggedIn: false,
    role: null,
    user: null
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decoded = jwtDecode(token);
        setAuth({
          isLoggedIn: true,
          role: decoded.role,
          user: decoded,
        });
      }
    } catch (error) {
      console.error("Token tidak valid:", error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    setAuth({
      isLoggedIn: true,
      role: decoded.role,
      user: decoded
    });
  };

  const handleLogout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error("Gagal menghubungi server saat logout:", error);
  } finally {
    localStorage.removeItem('authToken');
    setAuth({ isLoggedIn: false, role: null, user: null });
  }
};
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <NotificationProvider>
    <CartProvider>
    <Router>
      <div className="App">
        <Navbar auth={auth} onLogout={handleLogout} />
        <Routes>
        
          {/* --- Rute Publik --- */}
          <Route path="/" element={<KatalogPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />

          <Route element={<AuthRoute auth={auth} />}>
          <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* --- Rute Admin yang Dilindungi --- */}
          <Route element={<ProtectedRoute auth={auth}/>}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<ManageProductsPage />} />
            <Route path="/admin/add-product" element={<AddProductPage />} />
            <Route path="/admin/pesanan" element={<AdminPesananPage />} />
            <Route path="/admin/kasir" element={<KasirPage />} />
            <Route path="/admin/log" element={<LogPage />} />
            <Route
              path="/admin/edit-product/:id"
              element={<EditProductPage />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
    </CartProvider>
    </NotificationProvider>
  );
}

export default App;
