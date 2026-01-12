<?php



include 'fuzzy.php';

// Validasi input agar tidak error jika diakses langsung
if (!isset($_POST['luas'])) {
    header("Location: index.php");
    exit;
}

$luas   = $_POST['luas'];
$lokasi = $_POST['lokasi'];
$akses  = $_POST['akses'];
$tahun  = $_POST['tahun'];

// Fuzzifikasi
$μ_kecil  = kecil($luas);
$μ_sedang = sedang($luas);
$μ_besar  = besar($luas);

$μ_lokasi = lokasi($lokasi);
$μ_akses  = akses($akses);

// RULE BASE (Sugeno Orde 0)
$rules = [
    // KECIL
    [min($μ_kecil, 1, 1), 100000000],
    [min($μ_kecil, 0.5, 0.5), 50000000],

    // SEDANG
    [min($μ_sedang, 1, 1), 150000000],
    [min($μ_sedang, 1, 0.5), 200000000],
    [min($μ_sedang, 0.5, 0.5), 150000000],

    // BESAR
    [min($μ_besar, 1, 1), 250000000],
    [min($μ_besar, 1, 0.5), 200000000],
    [min($μ_besar, 0.5, 0.5), 200000000],
];

// Defuzzifikasi
$atas = 0;
$bawah = 0;

foreach ($rules as $r) {
    $atas += $r[0] * $r[1];
    $bawah += $r[0];
}


$harga_fuzzy = ($bawah != 0) ? $atas / $bawah : 0;

// Faktor Tahun
$tahun_dasar = 2020;
$kenaikan = 0.05;
$faktor = 1 + (($tahun - $tahun_dasar) * $kenaikan);

$harga_akhir = $harga_fuzzy * $faktor;

// Masukkan ke JSON (Tanpa Database)
$file_json = 'data.json';
$data_baru = [
    'luas' => $luas,
    'lokasi' => $lokasi,
    'akses' => $akses,
    'tahun' => $tahun,
    'harga_fuzzy' => $harga_fuzzy,
    'faktor_tahun' => $faktor,
    'harga_akhir' => $harga_akhir,
    'created_at' => date('Y-m-d H:i:s')
];

$data_history = [];
if (file_exists($file_json)) {
    $json_content = file_get_contents($file_json);
    $data_history = json_decode($json_content, true) ?? [];
}

// Tambahkan data baru
$data_history[] = $data_baru;

// Simpan kembali ke file
file_put_contents($file_json, json_encode($data_history, JSON_PRETTY_PRINT));
?>


<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hasil Estimasi - FuzzyTanah</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar">
        <a href="index.php" class="brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            FuzzyTanah
        </a>
    </nav>

    <div class="container" style="display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 80px);">
        <div class="card result-card">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Hasil Estimasi Harga</h2>
                <p style="color: var(--text-muted);">Dihitung menggunakan algoritma Sugeno</p>
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Luas Tanah</span>
                    <span class="value"><?= number_format($luas, 0, ',', '.'); ?> m²</span>
                </div>
                <div class="detail-item">
                    <span class="label">Tahun Penilaian</span>
                    <span class="value"><?= $tahun; ?></span>
                </div>
                <div class="detail-item">
                    <span class="label">Lokasi</span>
                    <span class="value"><?= ucfirst($lokasi); ?> Kota</span>
                </div>
                <div class="detail-item">
                    <span class="label">Akses Jalan</span>
                    <span class="value"><?= ucfirst($akses); ?></span>
                </div>
            </div>

            <div class="price-display">
                <small style="color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">Estimasi Harga Final</small>
                <div class="amount">Rp <?= number_format($harga_akhir, 0, ',', '.'); ?></div>
            </div>

            <div style="margin-bottom: 2rem; background: #fffbeb; border-radius: var(--radius-md); padding: 1rem; border: 1px solid #fef3c7;">
                <p style="font-size: 0.875rem; color: #92400e; font-weight: 600; margin-bottom: 0.5rem;">💡 Info Perhitungan:</p>
                <ul style="font-size: 0.85rem; color: #b45309; padding-left: 1.2rem; line-height: 1.4;">
                    <li>Harga Dasar (Metode Fuzzy): Rp <?= number_format($harga_fuzzy, 0, ',', '.'); ?></li>
                    <li>Penyesuaian Tahun (<?= $tahun; ?>): +<?= round(($faktor - 1) * 100); ?>% dari harga dasar</li>
                </ul>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <a href="index.php" class="btn-outline" style="margin-top: 0;">Hitung Ulang</a>
                <a href="riwayat.php" class="btn-primary">Lihat Riwayat</a>
            </div>
        </div>
    </div>

</body>
</html>

