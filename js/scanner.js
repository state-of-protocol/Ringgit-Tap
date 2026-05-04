/**
 * js/scanner.js - Fungsi QR Generator & Scanner
 * Versi Kemaskini: Prompt Interaktif & Fix QR Generator
 */

let html5QrCode;

/**
 * A. JANA QR (UNTUK TERIMA)
 * Mengambil alamat wallet user dan menukarkannya kepada imej QR
 */
function showReceiveQR() {
    const userData = localStorage.getItem('userData');
    if (!userData) {
        alert("Sila log masuk untuk melihat QR anda.");
        return;
    }

    const user = JSON.parse(userData);
    const dashboard = document.getElementById('dashboard-screen');
    const receiveModal = document.getElementById('receive-modal');
    
    // Guna Google Chart API untuk menjana QR secara dinamik
    const qrUrl = `https://googleapis.com{user.wallet_address}&choe=UTF-8`;
    
    document.getElementById('qrcode-area').innerHTML = `<img src="${qrUrl}" alt="My QR">`;
    
    dashboard.classList.add('hidden');
    receiveModal.classList.remove('hidden');
}

function closeReceive() {
    document.getElementById('receive-modal').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
}

/**
 * B. SCAN QR (UNTUK BAYAR)
 * Membuka kamera dan memproses alamat wallet yang diimbas
 */
function openScanner() {
    const dashboard = document.getElementById('dashboard-screen');
    const scannerUI = document.getElementById('scanner-container');
    
    dashboard.classList.add('hidden');
    scannerUI.classList.remove('hidden');

    html5QrCode = new Html5Qrcode("reader");
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        // 1. Berhentikan scanner serta-merta apabila QR dikesan
        stopScanner();

        // 2. Tanya user jumlah MYR yang ingin dihantar melalui prompt yang lebih jelas
        const amount = prompt(`QR Dikesan: ${decodedText}\n\nMasukkan jumlah nilai (MYR) untuk dihantar:`, "0.00");

        // 3. Jika user masukkan nilai, teruskan proses pembayaran melalui blockchain.js
        if (amount !== null && amount !== "" && !isNaN(amount) && parseFloat(amount) > 0) {
            processPayment(decodedText, amount); 
        } else if (amount !== null) {
            alert("Transaksi dibatalkan atau nilai angka tidak sah.");
        }
    }).catch((err) => {
        console.error("Kamera Error:", err);
        alert("Gagal mengakses kamera. Pastikan anda memberi izin akses.");
    });
}

/**
 * FUNGSI MEMBERHENTIKAN KAMERA
 */
function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        }).catch(err => {
            console.warn("Gagal memberhentikan scanner:", err);
            // Tetap tutup UI walaupun stop() gagal
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        });
    }
}

function closeScanner() {
    stopScanner();
}
