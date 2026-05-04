/**
 * js/scanner.js - Versi Offline QR & Scanner Robust
 * Tanpa bergantung pada API luar untuk privasi & kelajuan.
 */

let html5QrCode;

/**
 * A. JANA QR OFFLINE (UNTUK TERIMA)
 * Menggunakan library qrcode.js untuk menjana imej terus di memori telefon.
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
    console.log("Menjana QR Offline untuk:", walletAddress);

    // 2. Bersihkan kawasan QR lama dan paparkan modal
    qrArea.innerHTML = ""; 
    dashboard.classList.add('hidden');
    receiveModal.classList.remove('hidden');

    // 3. Jana QR secara Offline
    try {
        new QRCode(qrArea, {
            text: walletAddress,
            width: 200,
            height: 200,
            colorDark : "#4A3728", // Warna Espresso tema kita
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        // Cantikkan visual imej yang dihasilkan secara dinamik
        setTimeout(() => {
            const qrImg = qrArea.querySelector('img');
            const qrCanvas = qrArea.querySelector('canvas');
            if(qrImg) qrImg.style.margin = "auto";
            if(qrCanvas) qrCanvas.style.margin = "auto";
            
            qrArea.style.border = "10px solid white";
            qrArea.style.borderRadius = "15px";
            qrArea.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
        }, 100);
    } catch (err) {
        console.error("Gagal menjana QR Offline:", err);
        qrArea.innerHTML = "<p>Ralat menjana QR. Sila refresh.</p>";
    }
}

function closeReceive() {
    document.getElementById('receive-modal').classList.add('hidden');
    document.getElementById('dashboard-screen').classList.remove('hidden');
}

/**
 * B. SCAN QR (UNTUK BAYAR)
 * Membuka kamera dan memproses data yang diimbas.
 */
function openScanner() {
    const dashboard = document.getElementById('dashboard-screen');
    const scannerUI = document.getElementById('scanner-container');
    
    dashboard.classList.add('hidden');
    scannerUI.classList.remove('hidden');

    html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5QrCode.start({ facingMode: "environment" }, config, (decodedText) => {
        // 1. Berhentikan scanner serta-merta
        stopScanner();

        // 2. Tanya user jumlah MYR melalui prompt
        const amount = prompt(`QR Dikesan: ${decodedText}\n\nMasukkan jumlah nilai (MYR) untuk dihantar:`, "0.00");

        // 3. Validasi dan hantar ke blockchain.js
        if (amount !== null && amount !== "" && !isNaN(amount) && parseFloat(amount) > 0) {
            if (typeof processPayment === "function") {
                processPayment(decodedText, amount); 
            } else {
                alert("Ralat: Fail blockchain.js tidak ditemui atau belum dimuatkan.");
            }
        } else if (amount !== null) {
            alert("Transaksi dibatalkan atau nilai tidak sah.");
        }
    }).catch((err) => {
        console.error("Kamera Error:", err);
        alert("Gagal mengakses kamera. Sila pastikan izin diberikan.");
        closeScanner();
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
            console.warn("Scanner sudah berhenti atau ralat:", err);
            document.getElementById('scanner-container').classList.add('hidden');
            document.getElementById('dashboard-screen').classList.remove('hidden');
        });
    }
}

function closeScanner() {
    stopScanner();
}
