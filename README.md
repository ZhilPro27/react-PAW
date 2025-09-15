Aplikasi Katalog Online & Sistem Kasir (POS)
Selamat datang di proyek Aplikasi Katalog Online & Sistem Kasir (POS). Ini adalah aplikasi web full-stack yang dibangun dengan Node.js (Express.js) untuk backend dan React (MUI) untuk frontend.

Deskripsi Proyek
Aplikasi ini berfungsi sebagai platform untuk menampilkan katalog produk kepada publik, sekaligus menyediakan dasbor admin yang kuat untuk mengelola produk, pesanan, dan melihat laporan penjualan. Proyek ini mencakup alur autentikasi lengkap untuk pengguna dan admin, sistem keranjang belanja, hingga pencatatan transaksi dan pembuatan laporan PDF.

Fitur Utama
Fitur Publik & Pengguna (User)
👤 Registrasi & Login: Pengguna dapat membuat akun dan login ke sistem.

📚 Katalog Produk: Melihat daftar semua produk yang tersedia beserta gambar, harga, dan stok.

🛒 Keranjang Belanja: Menambahkan produk ke keranjang belanja yang persisten.

✅ Checkout: Mengajukan pesanan dari item di keranjang untuk disetujui oleh admin.

📄 Halaman Profil: Melihat detail akun pengguna yang sedang login.

Fitur Admin
🔐 Login Aman: Halaman login terpisah untuk admin.

📊 Dashboard Interaktif: Menampilkan ringkasan statistik penjualan seperti total pemasukan, jumlah transaksi, dan barang terlaris.

📦 Manajemen Produk (CRUD): Admin dapat menambah, melihat, mengedit (termasuk gambar), dan menghapus produk.

🛒 Manajemen Pesanan: Melihat daftar pesanan yang masuk dari pengguna dan memiliki opsi untuk Menerima atau Menolak pesanan.

🏪 Sistem Kasir (POS): Antarmuka kasir untuk melakukan transaksi penjualan langsung.

📄 Ekspor Laporan PDF: Kemampuan untuk mengunduh laporan penjualan lengkap dalam format PDF.

🛡️ Catatan Login/Logout: Mencatat semua aktivitas autentikasi untuk keperluan audit.

Teknologi yang Digunakan
Backend:

Node.js & Express.js

MySQL (mysql2/promise)

JSON Web Tokens (JWT) untuk autentikasi

Bcrypt.js untuk hashing password

Multer untuk upload file/gambar

PDFMake untuk pembuatan laporan PDF

Frontend:

React.js

React Router untuk navigasi

Material-UI (MUI) untuk komponen UI

Axios untuk permintaan API

React Context untuk state management global (Auth & Cart)


Instalasi
Prasyarat
Node.js (v18 atau lebih baru)

npm (biasanya terinstal bersama Node.js)

Server Database MySQL

Backend Setup
Clone repositori (jika ada) atau navigasi ke folder backend.

Buka terminal di dalam folder backend dan jalankan:

Bash

npm install
Buat database baru di MySQL Anda dengan nama yang Anda inginkan (misalnya, katalog_db).

Konfigurasi Environment:

Buat file baru bernama .env di dalam folder backend.

Salin isi dari bagian Environment Variables di bawah ke dalam file .env Anda.

Sesuaikan nilainya dengan konfigurasi database Anda.

Jalankan server backend:

Bash

npm start
Server akan berjalan di port yang Anda tentukan di .env (misalnya, 5000).

Frontend Setup
Buka terminal baru dan navigasi ke folder frontend.

Jalankan perintah untuk menginstal semua dependensi:

Bash

npm install
Jalankan aplikasi React:

Bash

npm start
Aplikasi akan terbuka di browser Anda, biasanya di http://localhost:3000.

Konfigurasi Environment Variables
Buat file .env di direktori backend dan isi dengan format berikut. Ganti nilainya sesuai dengan pengaturan lokal Anda.

Cuplikan kode

# Konfigurasi Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_database_anda
DB_NAME=katalog_db

# Konfigurasi Server
PORT=5000

# Konfigurasi Keamanan
JWT_SECRET=kunci_rahasia_jwt_anda_yang_sangat_panjang_dan_sulit_ditebak
