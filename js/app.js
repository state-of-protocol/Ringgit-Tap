/**
 * js/app.js - Enjin Utama Coffee-Pay
 * Versi Real-Time Blockchain Sync (LUM Network)
 */

// Konfigurasi Kadar Tukaran (1 LUM = RM 1.00)
const EXCHANGE_RATE = 1.0;

// Elemen UI
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const userDisplay = document.getElementById('user-display');
const myrBalance = document.getElementById('myr-balance');
const lumBalance = document.getElementById('lum-balance');

/**
 * 1. FUNGSI LOG MASUK (AUTHENTICATION)
 */
async function attemptLogin() {
    const emailInput = document.getElementById('email').value.trim();
    const walletInput = document.getElementById('wallet-id').value.trim();

    if (!emailInput || !walletInput) {
        alert("Sila masukkan e-mel dan alamat wallet anda.");
        return;
    }

    try {
        const response = await fetch('user.json');
        const data = await response.json();
        
        const user = data.users.find(u => 
            u.email === emailInput && u.wallet_address === walletInput
        );

        if (user) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(user));
            showDashboard(user);
        } else {
            alert("Akses Gagal: E-mel atau Alamat Wallet salah.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Ralat sistem: Gagal menyambung ke pangkalan data user.");
    }
}

/**
 * 2. PAPARAN DASHBOARD
 */
function showDashboard(user) {
    loginScreen.classList.add('hidden');
    dashboardScreen.style.display = 'block';
    
    userDisplay.innerText = `Hi, ${user.name}`;
    
    // Tarik Baki Sebenar dari Blockchain
    fetchBalance(user.wallet_address);
    
    // Tarik Sejarah Transaksi dari GitHub Ledger
    loadTransactionHistory();
}

/**
 * 3. PENGURUSAN BAKI SEBENAR (LUM REST API)
 * Menghubungkan PWA terus ke Ledger LUM Network via StakerHouse
 */
async function fetchBalance(address) {
    if (!address) return;
    
    // UI Feedback semasa memuatkan data
    myrBalance.style.opacity = "0.5";

    try {
        // API REST Real daripada StakerHouse
        const response = await fetch(`https://stakerhouse.com{address}`);
        const data = await response.json();
        
        // LUM Network menggunakan unit 'ulum' (1 LUM = 1,000,000 ulum)
        const lumData = data.balances.find(b => b.denom === "ulum");
        const rawBalance = lumData ? parseInt(lumData.amount) : 0;
        
        // Penukaran Unit
        const realLumBalance = rawBalance / 1000000;
        const totalMYR = realLumBalance * EXCHANGE_RATE;
        
        // Kemaskini UI
        myrBalance.innerText = `RM ${totalMYR.toFixed(2)}`;
        lumBalance.innerText = `${realLumBalance.toFixed(2)} LUM`;
        myrBalance.style.opacity = "1";

        console.log(`✅ Sync Blockchain Berjaya: ${realLumBalance} LUM`);

    } catch (error) {
        console.error("❌ Gagal menyambung ke LUM Endpoint:", error);
        myrBalance.innerText = "Ralat Sync";
        myrBalance.style.opacity = "1";
    }
}

/**
 * 4. PAPARAN SEJARAH TRANSAKSI (DYNAMIC LEDGER)
 */
async function loadTransactionHistory() {
    try {
        const response = await fetch('ledger.json');
        const data = await response.json();
        const listElement = document.getElementById('history-list');
        
        listElement.innerHTML = ''; 

        data.transactions.forEach(tx => {
            const color = tx.type === 'credit' ? 'green' : '#A0522D';
            const sign = tx.type === 'credit' ? '+' : '-';
            
            listElement.innerHTML += `
                <div class="history-item">
                    <div class="history-info">
                        <span class="title">${tx.description}</span>
                        <span class="time">${new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span class="amount" style="color: ${color}">${sign} RM ${tx.amount_myr.toFixed(2)}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error loading ledger:", error);
    }
}

/**
 * 5. LOG KELUAR
 */
function logout() {
    localStorage.clear();
    location.reload();
}

/**
 * 6. REQUEST ACCOUNT
 */
function requestAccount() {
    const email = prompt("Masukkan e-mel organisasi anda:");
    if (email) {
        alert("Permohonan dihantar. Admin akan menjana wallet LUM anda.");
    }
}

/**
 * 7. SEMAKAN SESI & AUTO-REFRESH
 */
window.onload = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');

    if (isLoggedIn === 'true' && userData) {
        showDashboard(JSON.parse(userData));
    }
};

// Pantau baki setiap 30 saat secara automatik (Live Sync)
setInterval(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        fetchBalance(user.wallet_address);
    }
}, 30000); 

// Daftar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('✅ PWA Offline Ready!'))
            .catch(err => console.log('❌ SW Registration Failed!'));
    });
}
