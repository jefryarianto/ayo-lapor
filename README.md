# Laporan Harian Proyek

Aplikasi PWA untuk membuat laporan harian proyek berupa gambar PNG. Aplikasi ini:

- Bekerja secara offline
- Bisa ambil foto dari kamera (dengan timestamp & GPS)
- Bisa upload dari galeri
- Simpan draft ke localStorage
- Generate layout seperti contoh
- Installable di HP Android/iOS

## Struktur File

- `index.html` - Halaman utama
- `css/style.css` - Styling
- `js/main.js` - Logika utama
- `js/html2canvas.min.js` - Library export PNG
- `manifest.json` - PWA manifest
- `sw.js` - Service worker
- `icons/` - Icon untuk PWA

## Cara Menjalankan

1. Buka `index.html` di browser
2. Install sebagai PWA
3. Matikan internet → aplikasi tetap berjalan

## Catatan

- Pastikan kamera dan lokasi diizinkan
- Untuk export PNG, `html2canvas` bekerja offline
