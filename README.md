# ☕ Coffee-Pay: Internal Organization Wallet
> **PWA Dompet Digital Nilai MYR Berasaskan Lejar LUM Network**

![Theme](https://shields.io)
![Currency](https://shields.io)
![Access](https://shields.io)

---

### 🪵 Visi Projek
**Coffee-Pay** adalah sistem transaksi nilai dalaman yang menggabungkan kestabilan blockchain dengan kemudahan aplikasi web moden (PWA). Walaupun teknologinya menggunakan **LUM Network**, pengguna hanya akan berurusan dengan nilai **Ringgit Malaysia (MYR)** untuk memudahkan urusan harian dalam organisasi.

---

### 🎨 Estetika & Antara Muka (UI)
Aplikasi ini direka dengan tema **Beige-Coffee** untuk memberikan suasana yang tenang dan profesional:
- **Cream (#F5F5DC)**: Latar belakang aplikasi yang bersih.
- **Latte (#C2B280)**: Elemen kad transaksi dan status.
- **Espresso (#4A3728)**: Teks utama, imbangan baki (MYR), dan bar navigasi.

---

### 🏛️ Model Pengurusan Akses (Admin-Centric)
Untuk menjaga integriti kewangan organisasi, pendaftaran dilakukan secara terkawal:

1.  **Permohonan Akses:** Calon pengguna menekan butang **"Buka Akaun & Dapatkan Wallet"** dan memasukkan e-mel organisasi.
2.  **Kelulusan Admin:** Admin menjana wallet LUM Network baru bagi pihak pengguna.
3.  **Pendaftaran Ledger:** Admin mengemaskini `user.json` di dalam repo GitHub.
4.  **Log Masuk (Kredential):**
    *   **ID Pengguna:** Alamat E-mel Berdaftar.
    *   **Kata Laluan Wallet:** Alamat Wallet LUM (Public Key) yang diberikan oleh admin.

---

### 🏗️ Struktur Data & Integrasi

#### 1. Pangkalan Data Ahli (`user.json`)
Sistem menggunakan fail JSON sebagai rujukan silang (cross-reference) untuk log masuk:
```json
{
  "users": [
    {
      "email": "staf_a@organisasi.com",
      "wallet_address": "lum1...address",
      "name": "Ahmad Coffee",
      "status": "active"
    }
  ]
}
```

#### 2. Pertukaran Nilai (LUM to MYR)
Aplikasi melakukan penterjemahan automatik secara *real-time*:
- **Input:** Baki Token LUM dari Blockchain.
- **Output:** Paparan RM (Contoh: `1 LUM = RM 1.00` - *Boleh dilaras mengikut polisi organisasi*).

---

### 📲 Ciri-Ciri Utama PWA
- **Installable:** Boleh dipasang terus pada skrin utama telefon tanpa melalui App Store.
- **QR Payment:** Pindah nilai MYR antara staf dengan hanya imbas kod QR.
- **Git-as-a-Ledger:** Setiap perpindahan nilai direkodkan melalui GitHub Commit sebagai bukti transaksi (Audit Trail).
- **Secure Access:** Penggunaan alamat wallet sebagai 'kata laluan' memastikan identiti unik bagi setiap akaun.

---

### 🛠️ Aliran Kerja Transaksi
1. **User A** imbas QR **User B**.
2. Masukkan jumlah **MYR**.
3. Sistem menghantar transaksi ke **LUM Network**.
4. **GitHub Action** mencetuskan kemaskini `ledger.csv` untuk paparan rekod awam organisasi.

---

### ☕ "Transparency brewed with security."
*Aplikasi ini adalah prototaip untuk kegunaan organisasi tertutup sahaja.*
