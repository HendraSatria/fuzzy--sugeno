// --- Fuzzy Logic Functions (Ported from fuzzy.php) ---

function fuzzyKecil(x) {
    if (x <= 100) return 1;
    if (x > 100 && x < 150) return (150 - x) / 50;
    return 0;
}

function fuzzySedang(x) {
    if (x === 150 || x === 300) return 1;
    if (x > 150 && x < 225) return (x - 150) / 75;
    if (x >= 225 && x < 300) return (300 - x) / 75;
    return 0;
}

function fuzzyBesar(x) {
    if (x === 300) return 1;
    if (x > 300 && x < 425) return (x - 300) / 125;
    if (x >= 425) return 1;
    return 0;
}

function fuzzyLokasi(x) {
    return (x === "dekat") ? 1 : 0.5;
}

function fuzzyAkses(x) {
    return (x === "mudah") ? 1 : 0.5;
}

// --- Main Calculation Function ---

function calculateAndDisplay(event) {
    event.preventDefault(); // Prevent actual form submission

    const luas = parseFloat(document.querySelector('input[name="luas"]').value);
    const lokasi = document.querySelector('select[name="lokasi"]').value;
    const akses = document.querySelector('select[name="akses"]').value;
    const tahun = parseInt(document.querySelector('input[name="tahun"]').value);

    if (!luas || !lokasi || !akses || !tahun) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    // Fuzzifikasi
    const μ_kecil = fuzzyKecil(luas);
    const μ_sedang = fuzzySedang(luas);
    const μ_besar = fuzzyBesar(luas);
    const μ_lokasi = fuzzyLokasi(lokasi);
    const μ_akses = fuzzyAkses(akses);

    // Rule Base (Sugeno Orde 0)
    // Format: [alpha_predikat, z_value]
    // alpha_predikat = min(μ_luas, μ_lokasi, μ_akses)
    // NOTE: The original PHP code min arguments were slightly inconsistent (min(kecil, 1, 1)). 
    // Adapting based on standard PHP min behavior and logic intent:
    // small/med/large is the primary fuzzy set, and locations/access seem to be modifiers or additional rules?
    // Wait, looking at PHP: min($μ_kecil, 1, 1). This is just $μ_kecil if max is 1. 
    // It seems the PHP code was simplified or just checking only Size for the rule firing strength?
    // Let's look closer at PHP:
    // [min($μ_kecil, 1, 1), 100000000],
    // This implies only 'luas' affects the rule strength in this specific implementation?
    // Actually, looking at the PHP code: 
    // $μ_lokasi and $μ_akses are calculated BUT NOT USED in the $rules array directly in the provided snippets.
    // Wait, let me re-read the `proses.php.bak` content in the history.
    // Line 29: [min($μ_kecil, 1, 1), 100000000],
    // The variables $μ_lokasi and $μ_akses are calculated in lines 23-24 but NEVEr used in $rules array (lines 27-41).
    // This looks like a bug or incomplete feature in the original PHP code. 
    // However, the User asked to "ubah bahasa PhP ke html tanPa merubah logika yang ada".
    // So I MUST preserve this behavior, even if it seems odd. I will strictly follow the PHP logic.

    const rules = [
        // KECIL
        [Math.min(μ_kecil, 1, 1), 100000000],
        [Math.min(μ_kecil, 0.5, 0.5), 50000000],

        // SEDANG
        [Math.min(μ_sedang, 1, 1), 150000000],
        [Math.min(μ_sedang, 1, 0.5), 200000000], // explicit 1 and 0.5 constant args in PHP
        [Math.min(μ_sedang, 0.5, 0.5), 150000000],

        // BESAR
        [Math.min(μ_besar, 1, 1), 250000000],
        [Math.min(μ_besar, 1, 0.5), 200000000],
        [Math.min(μ_besar, 0.5, 0.5), 200000000],
    ];

    // Defuzzifikasi (Weighted Average)
    let atas = 0;
    let bawah = 0;

    rules.forEach(r => {
        atas += r[0] * r[1];
        bawah += r[0];
    });

    const harga_fuzzy = (bawah !== 0) ? atas / bawah : 0;

    // Faktor Tahun
    const tahun_dasar = 2020;
    const kenaikan = 0.05;
    const faktor = 1 + ((tahun - tahun_dasar) * kenaikan);

    const harga_akhir = harga_fuzzy * faktor;

    // Save to History
    saveToHistory({
        luas, lokasi, akses, tahun, harga_fuzzy, faktor_tahun: faktor, harga_akhir, created_at: new Date().toISOString()
    });

    // Display Results
    renderResults({
        luas, lokasi, akses, tahun, harga_fuzzy, faktor, harga_akhir
    });
}

function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('fuzzy_history')) || [];
    history.push(data);
    localStorage.setItem('fuzzy_history', JSON.stringify(history));
}

function renderResults(data) {
    const heroSection = document.querySelector('.hero');
    const existingResult = document.querySelector('.result-card-container');

    // Remove existing result if any
    if (existingResult) existingResult.remove();

    // Hide hero slightly or scroll to result? Let's just append result.

    const formatter = new Intl.NumberFormat('id-ID');

    const html = `
    <div class="container result-card-container" style="margin-top: 2rem; display: flex; justify-content: center;">
        <div class="card result-card" style="width: 100%; max-width: 600px; animation: fadeIn 0.5s;">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">Hasil Estimasi Harga</h2>
                <p style="color: var(--text-muted);">Dihitung menggunakan algoritma Sugeno</p>
            </div>

            <div class="details-grid">
                <div class="detail-item">
                    <span class="label">Luas Tanah</span>
                    <span class="value">${formatter.format(data.luas)} m²</span>
                </div>
                <div class="detail-item">
                    <span class="label">Tahun Penilaian</span>
                    <span class="value">${data.tahun}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Lokasi</span>
                    <span class="value">${data.lokasi.charAt(0).toUpperCase() + data.lokasi.slice(1)} Kota</span>
                </div>
                <div class="detail-item">
                    <span class="label">Akses Jalan</span>
                    <span class="value">${data.akses.charAt(0).toUpperCase() + data.akses.slice(1)}</span>
                </div>
            </div>

            <div class="price-display">
                <small style="color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">Estimasi Harga Final</small>
                <div class="amount">Rp ${formatter.format(data.harga_akhir)}</div>
            </div>

            <div style="margin-bottom: 2rem; background: #fffbeb; border-radius: var(--radius-md); padding: 1rem; border: 1px solid #fef3c7;">
                <p style="font-size: 0.875rem; color: #92400e; font-weight: 600; margin-bottom: 0.5rem;">💡 Info Perhitungan:</p>
                <ul style="font-size: 0.85rem; color: #b45309; padding-left: 1.2rem; line-height: 1.4;">
                    <li>Harga Dasar (Metode Fuzzy): Rp ${formatter.format(data.harga_fuzzy)}</li>
                    <li>Penyesuaian Tahun (${data.tahun}): +${Math.round((data.faktor - 1) * 100)}% dari harga dasar</li>
                </ul>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <button onclick="document.querySelector('.result-card-container').remove()" class="btn-outline" style="margin-top: 0; text-align: center;">Hitung Ulang</button>
                <a href="riwayat.html" class="btn-primary" style="text-align: center; text-decoration: none;">Lihat Riwayat</a>
            </div>
        </div>
    </div>
    `;

    // Insert after hero
    heroSection.insertAdjacentHTML('afterend', html);

    // Scroll to result
    document.querySelector('.result-card-container').scrollIntoView({ behavior: 'smooth' });
}

// --- History Page Functions ---

function loadAndRenderHistory() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return; // Not on history page

    const history = JSON.parse(localStorage.getItem('fuzzy_history')) || [];

    // Sort by created_at DESC
    history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (history.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">Belum ada riwayat perhitungan.</td></tr>';
        return;
    }

    const formatter = new Intl.NumberFormat('id-ID');
    let html = '';

    history.forEach((r, index) => {
        const dateDate = new Date(r.created_at);
        const dateStr = dateDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        const timeStr = dateDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

        html += `
        <tr>
            <td>${index + 1}</td>
            <td>
                <div style="font-weight: 600;">${formatter.format(r.luas)} m²</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                    ${r.lokasi.charAt(0).toUpperCase() + r.lokasi.slice(1)} • ${r.akses.charAt(0).toUpperCase() + r.akses.slice(1)} • Thn ${r.tahun}
                </div>
            </td>
            <td class="hide-mobile">
                <span style="color: var(--text-muted); font-size: 0.9rem;">
                    ${formatter.format(r.harga_fuzzy)}
                </span>
            </td>
            <td class="hide-mobile">
                <span class="badge badge-primary">${r.faktor_tahun}x</span>
            </td>
            <td>
                <div style="font-weight: 700; color: var(--primary);">
                    Rp ${formatter.format(r.harga_akhir)}
                </div>
            </td>
            <td>
                <div style="font-size: 0.75rem; color: var(--text-muted);">
                    ${dateStr}<br>
                    ${timeStr}
                </div>
            </td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
}

// --- Init Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on index (form exists)
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', calculateAndDisplay);
    }

    // Check if we are on history page (table exists)
    const table = document.querySelector('table');
    if (table) {
        loadAndRenderHistory();
    }
});
