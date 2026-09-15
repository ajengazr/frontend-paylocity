import axios from 'axios';

// Alamat backend dibaca dari environment saat build. Sebelumnya nilainya
// ditulis mati ke localhost, sehingga hasil build tidak bisa dipakai di
// deployment mana pun tanpa menyunting kode sumbernya lebih dulu.
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;