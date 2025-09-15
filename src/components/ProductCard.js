import React from 'react';

const cardStyles = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  margin: '1rem',
  width: '250px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const imageStyles = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '4px'
};

const ProductCard = ({ item }) => {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(item.hargaBarang);


  const imageUrl = item.gambar 
    ? `http://localhost:5000/uploads/${item.gambar}` 
    : 'https://via.placeholder.com/150';

  return (
    <div style={cardStyles}>
      <img 
        src={imageUrl}
        alt={item.namaBarang} 
        style={imageStyles} 
      />
      <h3>{item.namaBarang}</h3>
      <h4>{formattedPrice}</h4>
      <p>Stok: {item.stokBarang}</p>
    </div>
  );
};

export default ProductCard;