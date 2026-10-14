# Fikk AI

Chatbot HTML untuk Android dengan backend Node.js dan OpenAI API.

## Yang dibutuhkan
- Node.js versi 18 atau lebih baru
- API key OpenAI dan akses API yang aktif

## Menjalankan di komputer
1. Ekstrak folder proyek.
2. Pasang Node.js dari https://nodejs.org/
3. Buka terminal di folder proyek.
4. Jalankan `npm install`.
5. Salin `.env.example` menjadi `.env`.
6. Isi `OPENAI_API_KEY` dengan API key milikmu.
7. Jalankan `npm start`.
8. Buka `http://localhost:3000` di browser.

## Mengakses dari HP
Untuk penggunaan di HP saja, server harus dijalankan di komputer/server yang bisa diakses HP, atau proyek harus di-deploy ke hosting Node.js yang mendukung environment variables dan HTTPS. Saat menggunakan komputer dan HP pada Wi-Fi yang sama, buka alamat IP lokal komputer dengan port 3000, misalnya `http://192.168.1.10:3000` (ganti dengan IP komputer sebenarnya). Izinkan akses port hanya pada jaringan tepercaya.

## Keamanan
- Jangan masukkan API key ke `index.html` atau membagikan file `.env`.
- Siapa pun yang dapat memakai server publik bisa menimbulkan biaya API. Tambahkan autentikasi, pembatasan penggunaan, dan rate limit sebelum membuka ke publik.
- Pemakaian API mungkin berbayar; ChatGPT Plus/Free tidak otomatis mencakup kredit API.
