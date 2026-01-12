<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FuzzyTanah - Estimasi Harga Tanah Cerdas</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar">
        <a href="index.php" class="brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            FuzzyTanah
        </a>
        <a href="riwayat.php" style="text-decoration: none; color: var(--text-muted); font-weight: 500; font-size: 0.9rem;">Riwayat</a>
    </nav>

    <div class="container">
        <!-- Hero Section -->
        <section class="hero">
            <div class="hero-content">
                <h1>Estimasi Harga Tanah <br><span>Cerdas & Akurat</span></h1>
                <p>Gunakan teknologi logika Fuzzy Sugeno untuk memprediksi harga tanah secara objektif berdasarkan data luas, lokasi, dan aksesibilitas.</p>
                
                <div class="hero-stats">
                    <div class="stat-item">
                        <h3>Fuzzy</h3>
                        <p>Sugeno Orde 0</p>
                    </div>
                    <div class="stat-item" style="border-left: 1px solid #e2e8f0; padding-left: 2rem;">
                        <h3>Realtime</h3>
                        <p>Kalkulasi Instan</p>
                    </div>
                </div>
            </div>

            <!-- Form Card -->
            <div class="form-container">
                <div style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Input Data Tanah</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Lengkapi informasi di bawah untuk melihat estimasi.</p>
                </div>

                <form action="proses.php" method="POST">
                    <div class="form-group">
                        <label>Luas Tanah (m²)</label>
                        <input type="number" class="form-control" name="luas" placeholder="Contoh: 150" required min="1">
                    </div>

                    <div class="form-group">
                        <label>Lokasi Tanah</label>
                        <select class="form-control" name="lokasi" required>
                            <option value="" disabled selected>Pilih Lokasi</option>
                            <option value="dekat">Dekat Pusat Kota</option>
                            <option value="jauh">Jauh dari Kota</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Akses Jalan</label>
                        <select class="form-control" name="akses" required>
                            <option value="" disabled selected>Pilih Kondisi Jalan</option>
                            <option value="mudah">Mudah Diakses (Mobil/Motor)</option>
                            <option value="sulit">Sulit Diakses (Gg. Sempit)</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Tahun Penilaian</label>
                        <input type="number" class="form-control" name="tahun" value="<?= date('Y'); ?>" required>
                    </div>

                    <button type="submit" class="btn-primary" style="margin-top: 1rem;">Hitung Estimasi Sekarang</button>
                    
                    <div style="text-align: center; margin-top: 1.5rem;">
                        <a href="riwayat.php" style="color: var(--primary); text-decoration: none; font-size: 0.85rem; font-weight: 500;">
                            📄 Lihat Riwayat Perhitungan
                        </a>
                    </div>
                </form>
            </div>
        </section>
    </div>

    <script src="js/script.js"></script>
</body>
</html>


