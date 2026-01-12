<?php


// Ambil data riwayat (terbaru di atas)
// Ambil data riwayat (terbaru di atas)
$file_json = 'data.json';
$data_riwayat = [];

if (file_exists($file_json)) {
    $json_content = file_get_contents($file_json);
    $data_riwayat = json_decode($json_content, true) ?? [];
}

// Urutkan by created_at DESC
usort($data_riwayat, function($a, $b) {
    return strtotime($b['created_at']) - strtotime($a['created_at']);
});
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Riwayat Perhitungan - FuzzyTanah</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        @media (max-width: 640px) {
            .hide-mobile { display: none; }
        }
    </style>
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar">
        <a href="index.php" class="brand">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            FuzzyTanah
        </a>
        <a href="index.php" class="btn-primary" style="width: auto; padding: 0.5rem 1rem; font-size: 0.8rem;">Hitung Baru</a>
    </nav>

    <div class="container">
        <div style="margin-bottom: 2rem;">
            <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">Riwayat Perhitungan</h1>
            <p style="color: var(--text-muted);">Data histori estimasi harga yang telah dilakukan.</p>
        </div>

        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Detail Tanah</th>
                        <th class="hide-mobile">Fuzzy (Rp)</th>
                        <th class="hide-mobile">Faktor Thn</th>
                        <th>Harga Akhir</th>
                        <th>Waktu</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $no=1; foreach($data_riwayat as $r) { ?>
                    <tr>
                        <td><?= $no++ ?></td>
                        <td>
                            <div style="font-weight: 600;"><?= number_format($r['luas'], 0, ',', '.') ?> m²</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">
                                <?= ucfirst($r['lokasi']) ?> • <?= ucfirst($r['akses']) ?> • Thn <?= $r['tahun'] ?>
                            </div>
                        </td>
                        <td class="hide-mobile">
                            <span style="color: var(--text-muted); font-size: 0.9rem;">
                                <?= number_format($r['harga_fuzzy'], 0, ',', '.') ?>
                            </span>
                        </td>
                        <td class="hide-mobile">
                            <span class="badge badge-primary"><?= $r['faktor_tahun'] ?>x</span>
                        </td>
                        <td>
                            <div style="font-weight: 700; color: var(--primary);">
                                Rp <?= number_format($r['harga_akhir'], 0, ',', '.') ?>
                            </div>
                        </td>
                        <td>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">
                                <?= date('d M Y', strtotime($r['created_at'])) ?><br>
                                <?= date('H:i', strtotime($r['created_at'])) ?> WIB
                            </div>
                        </td>
                    </tr>
                    <?php } ?>
                </tbody>
            </table>
        </div>

        <div style="margin-top: 2rem; text-align: center;">
            <a href="index.php" style="color: var(--text-muted); text-decoration: none; font-size: 0.9rem;">
                ⬅ Kembali ke Halaman Utama
            </a>
        </div>
    </div>

</body>
</html>

