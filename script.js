/* === LOGIKA PRELOADER (Harus di luar DOMContentLoaded) === */
window.addEventListener('load', function() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 300); // Waktu yang sama dengan transisi di CSS
    }
});


// =================================================================
// KODE UTAMA APLIKASI (DIJALANKAN SETELAH DOM SIAP)
// =================================================================
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. DEKLARASI VARIABEL (Diambil dengan aman) ---
    const lightTrail = document.querySelector('.cursor-light-trail');
    const htmlElement = document.documentElement;

    // Modals & Drawers
    const navDrawer = document.getElementById('nav-drawer');
    const drawerBackdrop = document.getElementById('drawer-backdrop');
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    const profileModal = document.getElementById('profile-modal');
    const profileIconBtn = document.getElementById('profile-icon-btn');
    const closeModalBtn = document.getElementById('modal-close-btn');

    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const settingsCloseBtn = document.getElementById('settings-close-btn');
    const themeToggleButton = document.getElementById('theme-toggle-icon'); // Tombol Dark/Light Mode

    // Login/Logout
    const loggedInView = document.getElementById('modal-logged-in-view');
    const loggedOutView = document.getElementById('modal-logged-out-view');
    const modalLoginBtn = document.getElementById('modal-login-btn');
    const modalLogoutBtn = document.getElementById('modal-logout-btn');

    
    // --- 2. FUNGSI UTILITY (Dark Mode & Ikon) ---

    // Fungsi untuk memperbarui ikon Dark Mode (Moon/Sun)
    function updateThemeIcon(theme) {
        if (!themeToggleButton) return; // Cek jika tombol ada
        const icon = themeToggleButton.querySelector('i');
        if (!icon) return; // Cek jika ikon di dalamnya ada
        
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
    
    // Fungsi untuk mengganti tema
    function toggleTheme() {
        // Cek apakah class dark-mode ada pada elemen <html>
        const isCurrentlyDark = htmlElement.classList.contains('dark-mode');
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        
        htmlElement.classList.toggle('dark-mode');
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    // --- 3. FUNGSI MODAL DAN DRAWER ---

    function toggleBackdrop(isVisible) {
        if(drawerBackdrop) drawerBackdrop.classList.toggle('hidden', !isVisible);
    }
    
    // Menutup semua pop-up dan backdrop
    function closeAllPopups() {
        if(navDrawer) navDrawer.classList.remove('open');
        if(profileModal) profileModal.classList.add('hidden');
        if(settingsModal) settingsModal.classList.add('hidden');
        if(drawerBackdrop) drawerBackdrop.classList.add('hidden');
    }
    
    // --- 4. FUNGSI SIMULASI AKUN ---

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (loggedInView && loggedOutView) {
            loggedInView.classList.toggle('hidden', !isLoggedIn);
            loggedOutView.classList.toggle('hidden', isLoggedIn);
        }
    }

    // --- 5. INITIALISASI DAN EVENT LISTENERS ---

    // A. INITIAL TEMA & ICON 
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        updateThemeIcon(savedTheme); 
    } else {
        updateThemeIcon('light'); // Default ke ikon 'light' (bulan)
    }
    
    // B. INITIAL STATUS LOGIN
    checkLoginStatus(); 


    // C. LISTENERS GLOBAL

    // Dark Mode Toggle
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }
    
    // Nav Drawer (Hamburger)
    if (menuToggleBtn) menuToggleBtn.addEventListener('click', () => {
        closeAllPopups(); // Tutup semua yang lain
        if (navDrawer) navDrawer.classList.add('open');
        if (drawerBackdrop) drawerBackdrop.classList.remove('hidden');
    });
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeAllPopups);
    drawerLinks.forEach(link => { 
        if(link) link.addEventListener('click', closeAllPopups); 
    }); 

    // Modal Profil
    if (profileIconBtn) profileIconBtn.addEventListener('click', () => {
        closeAllPopups(); // Tutup semua yang lain
        if (profileModal) profileModal.classList.remove('hidden');
        if (drawerBackdrop) drawerBackdrop.classList.remove('hidden');
        checkLoginStatus(); 
    });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAllPopups);
    if (profileModal) profileModal.addEventListener('click', (e) => {
        if (e.target === profileModal) { closeAllPopups(); }
    });

    // Modal Pengaturan (Settings Modal)
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', () => {
            // Perbaikan bug: Perbarui ikon sebelum membuka modal (masalah saklar)
            const currentTheme = localStorage.getItem('theme') || 'light';
            updateThemeIcon(currentTheme); 
            
            if(profileModal) profileModal.classList.add('hidden');
            if(settingsModal) settingsModal.classList.remove('hidden');
            if (drawerBackdrop) drawerBackdrop.classList.remove('hidden');
        });
    }
    if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeAllPopups);
    if (settingsModal) settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) { closeAllPopups(); }
    });

    // Login/Logout Simulasi
    if (modalLoginBtn) modalLoginBtn.addEventListener('click', () => {
        localStorage.setItem('isLoggedIn', 'true');
        closeAllPopups();
        alert("Simulasi Log In Berhasil!");
    });
    if (modalLogoutBtn) modalLogoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem('isLoggedIn', 'false');
        closeAllPopups();
        alert("Anda berhasil Log Out (Simulasi)!");
    });

    // Backdrop global click (Menutup semua jika klik di luar popup)
    if (drawerBackdrop) {
        drawerBackdrop.addEventListener('click', closeAllPopups);
    }
    
    // --- 6. FITUR 1: EFEK "AI GLOW" (Kursor) ---
    if (lightTrail) { 
        function updateGlowPosition(e) {
            let x, y;
            if (e.touches) { x = e.touches[0].clientX; y = e.touches[0].clientY; } 
            else { x = e.clientX; y = e.clientY; }
            lightTrail.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }
        document.addEventListener('mousemove', updateGlowPosition);
        document.addEventListener('mouseleave', () => { lightTrail.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { lightTrail.style.opacity = '1'; });
        document.addEventListener('touchmove', updateGlowPosition);
        document.addEventListener('touchstart', () => { lightTrail.style.opacity = '1'; });
        document.addEventListener('touchend', () => { lightTrail.style.opacity = '0'; });
    }

}); // <-- PENUTUP document.addEventListener("DOMContentLoaded")
