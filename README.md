Katalog Online & Sistem Kasir (POS) 🏪
Selamat datang di proyek Katalog Online & Sistem Kasir (POS). Ini adalah aplikasi web full-stack yang dibangun dengan Node.js untuk backend dan React untuk frontend, dilengkapi dengan antarmuka modern menggunakan Material-UI (MUI).

Aplikasi ini berfungsi sebagai platform untuk menampilkan katalog produk kepada publik, sekaligus menyediakan dasbor admin yang kuat untuk mengelola produk, pesanan, dan melihat laporan penjualan.

Fitur Utama ✨
Sisi Pengguna (User)
👤 Autentikasi: Registrasi dan login akun.

📚 Katalog Produk: Melihat daftar produk lengkap dengan gambar, harga, dan stok.

🛒 Keranjang Belanja: Menambah produk ke keranjang belanja.

✅ Checkout: Mengajukan pesanan untuk disetujui oleh admin.

📄 Profil Pengguna: Melihat detail akun.

Sisi Admin
🔐 Login Aman: Halaman login khusus untuk admin.

📊 Dasbor Interaktif: Memantau ringkasan penjualan, barang terlaris, dan jumlah transaksi.

📦 Manajemen Produk (CRUD): Menambah, melihat, mengedit (termasuk gambar), dan menghapus produk.

🛒 Manajemen Pesanan: Menerima atau menolak pesanan yang masuk dari pengguna.

🏪 Sistem Kasir (POS): Antarmuka kasir untuk transaksi penjualan langsung.

📄 Ekspor Laporan PDF: Mengunduh laporan penjualan lengkap dalam format PDF.

🛡️ Log Aktivitas: Mencatat semua aktivitas login dan logout untuk audit keamanan.

Tumpukan Teknologi 🥞
Peran	Teknologi
Backend	Node.js, Express.js, MySQL (mysql2), JWT, Bcrypt, Multer, PDFMake
Frontend	React, React Router, Material-UI (MUI), Axios, React Context

Ekspor ke Spreadsheet
Instalasi & Konfigurasi 🚀
Prasyarat
Node.js (v18 atau lebih baru)

NPM (terinstal bersama Node.js)

Server MySQL

1. Backend
Bash

# Masuk ke folder backend
cd backend

# Instal semua dependensi
npm install

# Buat database baru di MySQL (misal: katalog_db)

# Salin file .env.example menjadi .env
cp .env.example .env

# Sesuaikan isi file .env dengan konfigurasi database Anda

# Jalankan server
npm start
Server backend akan berjalan di http://localhost:5000 (atau sesuai port di .env).

2. Frontend
Bash

# Buka terminal baru, masuk ke folder frontend
cd frontend

# Instal semua dependensi
npm install

# Jalankan aplikasi React
npm start
Aplikasi frontend akan terbuka di http://localhost:3000.

Variabel Lingkungan (.env)
Buat file .env di dalam direktori backend dan isi sesuai contoh di bawah ini.

Cuplikan kode

# Konfigurasi Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_anda
DB_NAME=katalog_db

# Konfigurasi Server
PORT=5000

# Konfigurasi Keamanan (ganti dengan kunci rahasia Anda sendiri)
JWT_SECRET=kunci_rahasia_yang_sangat_aman_dan_panjang
