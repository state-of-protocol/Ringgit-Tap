/**
 * js/app.js - Enjin Utama Coffee-Pay
 * Menguruskan Autentikasi, UI, dan Data Ledger
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
        alert("Sila masukkan e-mel dan alamat wallet (password) anda.");
        return;
    }

    try {
        // Ambil data user dari user.json (GitHub Ledger)
        const response = await fetch('user.json');
        const data = await response.json();
        
        // Cari user yang sepadan
        const user = data.users.find(u => 
            u.email === emailInput && u.wallet_address === walletInput
        );

        if (user) {
            // Simpan sesi dalam LocalStorage
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
    
    // Kemaskini Nama User
    userDisplay.innerText = `Hi, ${user.name}`;
    
    // Tarik Baki
    fetchBalance(user.wallet_address);
    
    // Tarik Sejarah Transaksi
    loadTransactionHistory();
}

/**
 * 3. PENGURUSAN BAKI (LUM TO MYR)
 */
async function fetchBalance(address) {
    // Simulasi baki (Integrasi Web3/Loom.js di sini nanti)
    const mockLumBalance = 125.50; 
    
    const totalMYR = mockLumBalance * EXCHANGE_RATE;
    
    myrBalance.innerText = `RM ${totalMYR.toFixed(2)}`;
    lumBalance.innerText = `${mockLumBalance.toFixed(2)} LUM`;
}

/**
 * 4. PAPARAN SEJARAH TRANSAKSI (DYNAMIC LEDGER)
 */
async function loadTransactionHistory() {
    try {
        const response = await fetch('ledger.json');
        const data = await response.json();
        const listElement = document.getElementById('history-list');
        
        listElement.innerHTML = ''; // Kosongkan list lama

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
 * 6. REQUEST ACCOUNT (SISTEM ADMIN)
 */
function requestAccount() {
    const email = prompt("Masukkan e-mel organisasi anda untuk pendaftaran akaun baru:");
    if (email) {
        alert("Permohonan telah dihantar. Admin akan menjana wallet LUM anda.");
    }
}

/**
 * 7. SEMAKAN SESI (ON LOAD)
 */
window.onload = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');

    if (isLoggedIn === 'true' && userData) {
        showDashboard(JSON.parse(userData));
    }
};

// Daftar Service Worker untuk fungsi PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('✅ Service Worker Berdaftar!'))
            .catch(err => console.log('❌ Pendaftaran Gagal!'));
    });
}
