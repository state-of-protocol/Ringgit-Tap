/**
 * js/scanner.js - Fungsi QR Generator & Scanner
 */

let html5QrCode;

/**
 * A. JANA QR (UNTUK TERIMA)
 */
function showReceiveQR() {
    const user = JSON.parse(localStorage.getItem('userData'));
    const dashboard = document.getElementById('dashboard-screen');
    const receiveModal = document.getElementById('receive-modal');
    
    // Guna Google Chart API (Paling senang & laju)
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
 */
function openScanner() {
    const dashboard = document.getElementById('dashboard-screen');
    const scannerUI = document.getElementById('scanner-container');
    
    dashboard.classList.add('hidden');
    scannerUI.classList.remove('hidden');

    html5QrCode = new Html5Qrcode("reader");
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        // Jika scan berjaya:
        stopScanner();
        const amount = prompt(`Masukkan jumlah MYR untuk dihantar ke ${decodedText}:`);
        if (amount && !isNaN(amount)) {
            processPayment(decodedText, amount); // Panggil fungsi dari blockchain.js
        }
    }).catch((err) => {
        console.error("Kamera Error:", err);
    });
}

function stopScanner() {
    if (html5QrCode) {
        html5QrCode.stop().then(() => {
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        });
    }
}

function closeScanner() {
    stopScanner();
}
