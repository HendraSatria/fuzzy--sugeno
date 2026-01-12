const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Membuat window browser utama
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(__dirname, 'icon.png'), // Opsional: pastikan ada file icon.png jika ingin menggunakan icon
        webPreferences: {
            nodeIntegration: true, // Hati-hati dengan keamanan di produksi, tapi ok untuk aplikasi lokal offline
            contextIsolation: false
        }
    });

    // Memuat index.html aplikasi
    mainWindow.loadFile('index.html');

    // Menghilangkan menu bawaan (File, Edit, dll) agar lebih bersih
    mainWindow.setMenuBarVisibility(false);

    // Buka DevTools (opsional, untuk debugging)
    // mainWindow.webContents.openDevTools();
}

// Event ketika Electron siap
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Event ketika semua window ditutup
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
