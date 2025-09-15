import React, { createContext, useState, useContext } from 'react';
import { useNotification } from './notificationContext'; 

const CartContext = createContext();


export const useCart = () => {
  return useContext(CartContext);
};


export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { showNotification } = useNotification(); 

  const addToCart = (productToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.idBarang === productToAdd.idBarang);

      if (existingItem) {

        showNotification(`${productToAdd.namaBarang} ditambahkan ke keranjang.`, 'info');
        return prevItems.map(item =>
          item.idBarang === productToAdd.idBarang
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showNotification(`${productToAdd.namaBarang} ditambahkan ke keranjang.`, 'success');
        return [...prevItems, { ...productToAdd, quantity: 1 }];
      }
    });
  };


  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.idBarang !== productId));
    showNotification(`Barang dihapus dari keranjang.`, 'warning');
  };

  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.idBarang === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  
  const clearCart = () => {
    setCartItems([]);
  };


  const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.hargaBarang * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotalItems,
    cartTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};