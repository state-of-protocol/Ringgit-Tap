/**
 * js/scanner.js - Fungsi QR Generator & Scanner
 * Versi Robust: Fix String Interpolation & Debugging
 */

let html5QrCode;

/**
 * A. JANA QR (UNTUK TERIMA)
 * Mengambil alamat wallet user dan menukarkannya kepada imej QR
 */
function showReceiveQR() {
    const dashboard = document.getElementById('dashboard-screen');
    const receiveModal = document.getElementById('receive-modal');
    const qrArea = document.getElementById('qrcode-area');
    
    // 1. Ambil data user dari LocalStorage
    const userData = localStorage.getItem('userData');
    
    if (!userData) {
        alert("Sila log masuk semula untuk melihat QR anda.");
        return;
    }

    const user = JSON.parse(userData);
    const walletAddress = user.wallet_address;

    // Debugging untuk console
    console.log("Menjana QR untuk alamat:", walletAddress);

    // 2. Paparkan Modal Dahulu
    dashboard.classList.add('hidden');
    receiveModal.classList.remove('hidden');

    // 3. Bina URL QR (Menggunakan Google Chart API yang diperbetulkan)
    // PASTIKAN menggunakan simbol backtick (`) dan ${walletAddress}
    const qrUrl = `https://googleapis.com{encodeURIComponent(walletAddress)}&chs=250x250&choe=UTF-8`;

    // 4. Masukkan imej ke dalam UI
    if (qrArea) {
        qrArea.innerHTML = `<img src="${qrUrl}" alt="My QR Code" style="width: 200px; height: 200px; display: block; margin: auto; border: 5px solid white; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">`;
    }
}

function closeReceive() {
    document.getElementById('receive-modal').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
}

/**
 * B. SCAN QR (UNTUK BAYAR)
 */
function openScanner() {
    const dashboard = document.getElementById('dashboard-screen');
    const scannerUI = document.getElementById('scanner-container');
    
    dashboard.classList.add('hidden');
    scannerUI.classList.remove('hidden');

    html5QrCode = new Html5Qrcode("reader");
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        // 1. Berhentikan scanner
        stopScanner();

        // 2. Tanya user jumlah MYR
        const amount = prompt(`QR Dikesan: ${decodedText}\n\nMasukkan jumlah nilai (MYR) untuk dihantar:`, "0.00");

        // 3. Proses jika input sah
        if (amount !== null && amount !== "" && !isNaN(amount) && parseFloat(amount) > 0) {
            if(typeof processPayment === "function") {
                processPayment(decodedText, amount); 
            } else {
                alert("Ralat: Fail blockchain.js tidak ditemui.");
            }
        } else if (amount !== null) {
            alert("Transaksi dibatalkan atau nilai tidak sah.");
        }
    }).catch((err) => {
        console.error("Kamera Error:", err);
        alert("Gagal mengakses kamera.");
    });
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        }).catch(err => {
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        });
    }
}

function closeScanner() {
    stopScanner();
}
