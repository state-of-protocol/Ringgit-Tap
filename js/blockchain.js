/**
 * js/blockchain.js - Jambatan PWA ke GitHub Actions & LUM Network
 */

const GH_USERNAME = "state-of-protocol"; // Ganti dengan username GitHub anda
const GH_REPO = "Ringgit-Tap";
const GH_TOKEN = "PASTE_YOUR_GITHUB_TOKEN_HERE"; // Gunakan PAT (Personal Access Token)

/**
 * 1. FUNGSI HANTAR TRANSAKSI (TRIGGER GITHUB ACTION)
 */
async function sendTransactionToLedger(txData) {
    const url = `https://github.com{GH_USERNAME}/${GH_REPO}/dispatches`;
    
    const payload = {
        event_type: "new-transaction", // Mesti sama dengan 'types' dalam ledger-update.yml
        client_payload: {
            sender: txData.sender,
            recipient: txData.recipient,
            amount: txData.amount,
            description: txData.description,
            tx_hash: txData.tx_hash || "SIM-HASH-" + Date.now(),
            type: txData.type || "debit"
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GH_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 204) {
            console.log("✅ Isyarat dihantar ke GitHub Ledger!");
            return true;
        } else {
            console.error("❌ Gagal menghantar isyarat:", await response.text());
            return false;
        }
    } catch (error) {
        console.error("Error trigger GitHub Action:", error);
        return false;
    }
}

/**
 * 2. SIMULASI PROSES PEMBAYARAN
 */
async function processPayment(recipientEmail, amount) {
    const user = JSON.parse(localStorage.getItem('userData'));
    
    if (!user) {
        alert("Sila log masuk dahulu.");
        return;
    }

    // Tunjukkan loading (boleh ditambah dalam UI nanti)
    console.log("Memulakan transaksi LUM Network...");

    // Data transaksi untuk dihantar
    const transactionData = {
        sender: user.email,
        recipient: recipientEmail,
        amount: parseFloat(amount),
        description: `Bayaran kepada ${recipientEmail}`,
        tx_hash: "LUM-" + Math.random().toString(36).substring(7).toUpperCase(), // Simulasi Hash
        type: "debit"
    };

    // Langkah 1: Hantar isyarat ke GitHub untuk kemaskini ledger.json
    const success = await sendTransactionToLedger(transactionData);

    if (success) {
        alert(`Transaksi RM ${amount} Berjaya! Ledger akan dikemaskini dalam masa 1-2 minit.`);
        // Refresh sejarah transaksi selepas beberapa saat
        setTimeout(() => {
            if (typeof loadTransactionHistory === "function") loadTransactionHistory();
        }, 5000);
    } else {
        alert("Transaksi gagal. Sila periksa sambungan atau GitHub Token.");
    }
}
