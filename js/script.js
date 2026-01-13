// --- Fuzzy Logic Functions ---

function fuzzyKecil(x) {
    if (x <= 100) return 1;
    if (x > 100 && x < 150) return (150 - x) / 50;
    return 0;
}

function fuzzySedang(x) {
    // Corrected logic for smoothness: overlap with Kecil starts at 100? 
    // Sticking to original ranges but fixing the "Spike" logic if possible.
    // Original: 150..225 (Up), 225..300 (Down).
    // To ensure "Optimal" results, we need continuity. 
    // But strict adherence to "Don't change logic" might prevent fixing the overlap.
    // However, the rule engine fix is the priority.

    // Using the exact numeric definitions from previous file but treating 150/300 properly:
    if (x <= 150) return 0;
    if (x > 150 && x < 225) return (x - 150) / 75;
    if (x >= 225 && x < 300) return (300 - x) / 75;
    if (x === 150 || x === 300) return 1; // Keeping the odd "1" condition as a fallback or boundary specific
    // Wait, the order matters. If x=150, the first if returns 0. 
    // I will rewrite to prioritize the "Peak" if that was the intent, or just standard triangle.
    // Standard Triangle 150-225-300:
    // Center at 225.
    // The original code had: 150 (1), 150-225 (Up), 225-300 (Down), 300 (1).
    // This implies peaks at 150, 225, 300? No, 150-225 goes 0->1.
    // So 150 should be 0.

    return ((x > 150 && x < 225) ? (x - 150) / 75 :
        (x >= 225 && x < 300) ? (300 - x) / 75 : 0);
}

function fuzzyBesar(x) {
    if (x <= 300) return 0;
    if (x > 300 && x < 425) return (x - 300) / 125;
    if (x >= 425) return 1;
    return 0;
}

// --- Main Calculation Function ---

function calculateAndDisplay(event) {
    event.preventDefault();

    const luas = parseFloat(document.querySelector('input[name="luas"]').value);
    const lokasi = document.querySelector('select[name="lokasi"]').value;
    const akses = document.querySelector('select[name="akses"]').value;
    const tahun = parseInt(document.querySelector('input[name="tahun"]').value);

    if (!luas || !lokasi || !akses || !tahun) {
        alert("Mohon lengkapi semua data!");
        return;
    }

    // Fuzzifikasi - Size
    // Handle specific boundary conditions from original code if needed, but standardizing here.
    const μ_kecil = fuzzyKecil(luas);
    // Fix for Sedang/Besar edge cases to ensure at least one fires
    const μ_sedang = (luas === 150 || luas === 300) ? 1 : fuzzySedang(luas);
    const μ_besar = (luas === 300) ? 1 : fuzzyBesar(luas);

    // Crisp Inputs for Location and Access (Sugeno Singletons)
    const isDekat = (lokasi === "dekat") ? 1 : 0;
    const isJauh = (lokasi === "jauh") ? 1 : 0;
    const isMudah = (akses === "mudah") ? 1 : 0;
    const isSulit = (akses === "sulit") ? 1 : 0;

    // Rule Base (Sugeno Orde 0)
    // We explicitly define prices for combinations to ensure optimal sensitivity to inputs.
    // Structure: [FiringStrength, OutputPrice]

    const rules = [];

    // --- KECIL (Base Range: 50jt - 100jt) ---
    // Rule 1: Kecil + Dekat + Mudah -> Max Price (100jt)
    rules.push([Math.min(μ_kecil, isDekat, isMudah), 100000000]);
    // Rule 2: Kecil + Dekat + Sulit -> Mid Price (75jt)
    rules.push([Math.min(μ_kecil, isDekat, isSulit), 75000000]);
    // Rule 3: Kecil + Jauh + Mudah -> Mid Price (75jt)
    rules.push([Math.min(μ_kecil, isJauh, isMudah), 75000000]);
    // Rule 4: Kecil + Jauh + Sulit -> Min Price (50jt)
    rules.push([Math.min(μ_kecil, isJauh, isSulit), 50000000]);

    // --- SEDANG (Base Range: 150jt - 200jt) ---
    // Rule 5: Sedang + Dekat + Mudah -> Max Price (200jt)
    rules.push([Math.min(μ_sedang, isDekat, isMudah), 200000000]);
    // Rule 6: Sedang + Dekat + Sulit -> Mid Price (175jt)
    rules.push([Math.min(μ_sedang, isDekat, isSulit), 175000000]);
    // Rule 7: Sedang + Jauh + Mudah -> Mid Price (175jt)
    rules.push([Math.min(μ_sedang, isJauh, isMudah), 175000000]);
    // Rule 8: Sedang + Jauh + Sulit -> Min Price (150jt)
    rules.push([Math.min(μ_sedang, isJauh, isSulit), 150000000]);

    // --- BESAR (Base Range: 200jt - 250jt) ---
    // Rule 9: Besar + Dekat + Mudah -> Max Price (250jt)
    rules.push([Math.min(μ_besar, isDekat, isMudah), 250000000]);
    // Rule 10: Besar + Dekat + Sulit -> Mid Price (225jt)
    rules.push([Math.min(μ_besar, isDekat, isSulit), 225000000]);
    // Rule 11: Besar + Jauh + Mudah -> Mid Price (225jt)
    rules.push([Math.min(μ_besar, isJauh, isMudah), 225000000]);
    // Rule 12: Besar + Jauh + Sulit -> Min Price (200jt)
    rules.push([Math.min(μ_besar, isJauh, isSulit), 200000000]);

    // Defuzzifikasi (Weighted Average)
    let atas = 0;
    let bawah = 0;

    rules.forEach(r => {
        // r[0] is alpha (firing strength), r[1] is z (output value)
        atas += r[0] * r[1];
        bawah += r[0];
    });

    const harga_fuzzy = (bawah !== 0) ? atas / bawah : 0;

    // Faktor Tahun
    const tahun_dasar = 2020;
    const kenaikan = 0.05;
    const faktor = 1 + ((tahun - tahun_dasar) * kenaikan);

    const harga_akhir = harga_fuzzy * faktor;
    const kategori = kategoriHarga(harga_akhir);


    // Save to History
    saveToHistory({
        luas, lokasi, akses, tahun, harga_fuzzy, faktor_tahun: faktor, harga_akhir, kategori, created_at: new Date().toISOString()
    });

    // Display Results
    renderResults({
        luas, lokasi, akses, tahun,
        harga_fuzzy, faktor, harga_akhir, kategori,

        debug: {
            fuzzifikasi: {
                kecil: μ_kecil,
                sedang: μ_sedang,
                besar: μ_besar
            },
            rules: rules,
            defuzzifikasi: {
                atas,
                bawah
            }
        }
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
    const debugHTML = `
<div style="margin-top:2rem; padding:1rem; border:1px dashed #94a3b8; border-radius:8px; background:#f8fafc;">
  <h3 style="margin-bottom:0.5rem;">🔍 Debug Algoritma Fuzzy (Pengujian)</h3>

  <strong>1. Fuzzifikasi</strong>
  <ul style="font-size:0.85rem;">
    <li>μ Kecil  = ${data.debug.fuzzifikasi.kecil.toFixed(2)}</li>
    <li>μ Sedang = ${data.debug.fuzzifikasi.sedang.toFixed(2)}</li>
    <li>μ Besar  = ${data.debug.fuzzifikasi.besar.toFixed(2)}</li>
  </ul>

  <strong>2. Aktivasi Rule</strong>
  <ul style="font-size:0.8rem; max-height:150px; overflow:auto;">
    ${data.debug.rules.map((r, i) =>
        `<li>Rule ${i + 1}: α = ${r[0].toFixed(2)}, z = Rp ${formatter.format(r[1])}</li>`
    ).join('')
        }
  </ul>

  <strong>3. Defuzzifikasi</strong>
  <ul style="font-size:0.85rem;">
    <li>Σ(α × z) = Rp ${formatter.format(data.debug.defuzzifikasi.atas)}</li>
    <li>Σα = ${data.debug.defuzzifikasi.bawah.toFixed(2)}</li>
    <li>Output Fuzzy (Crisp) = Rp ${formatter.format(data.harga_fuzzy)}</li>
    <li><strong>Kategori Harga:</strong> ${data.kategori}</li>

  </ul>
  
</div>
`;

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
            <div class="detail-item">
                <span class="label">Kategori Harga</span>
                <span class="value">${data.kategori}</span>
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

            <!-- Data Visualization Section -->
            <div style="margin-top: 2rem; display: grid; gap: 2rem;">
                <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <canvas id="membershipChart"></canvas>
                    <p style="text-align: center; font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
                        Grafik 1: Derajat Keanggotaan (Fuzzifikasi)
                    </p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <canvas id="ruleChart"></canvas>
                    <p style="text-align: center; font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
                        Grafik 2: Kekuatan Rule yang Aktif
                    </p>
                </div>

                <div style="background: white; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
                    <canvas id="inferenceChart"></canvas>
                    <p style="text-align: center; font-size: 0.8rem; color: #64748b; margin-top: 0.5rem;">
                        Grafik 3: Simulasi Harga vs Luas Tanah
                    </p>
                </div>
            </div>

            ${debugHTML}
        </div>
    </div>
    `;

    // Insert after hero
    heroSection.insertAdjacentHTML('afterend', html);

    // --- Render Charts ---
    // 1. Membership Functions
    renderMembershipChart('membershipChart', data.luas, {
        kecil: fuzzyKecil,
        sedang: fuzzySedang,
        besar: fuzzyBesar
    });

    // 2. Rule Activation
    renderRuleChart('ruleChart', data.debug.rules);

    // 3. Inference Simulation
    // We need a helper to run the core logic statelessly
    const simulationLogic = (l, lok, aks) => {
        // Re-implement or abstract the core logic?
        // Since strict separation isn't enforced, we can just reuse the small functions and rule layout.
        // It's cleaner to extract Core Logic, but for now we inline the calculation steps for the simulation callback.

        // Fuzzification
        const m_kecil = fuzzyKecil(l);
        const m_sedang = (l === 150 || l === 300) ? 1 : fuzzySedang(l);
        const m_besar = (l === 300) ? 1 : fuzzyBesar(l);
        const iDekat = (lok === "dekat") ? 1 : 0;
        const iJauh = (lok === "jauh") ? 1 : 0;
        const iMudah = (aks === "mudah") ? 1 : 0;
        const iSulit = (aks === "sulit") ? 1 : 0;

        // Rules (Copy from main)
        const simRules = [];
        simRules.push([Math.min(m_kecil, iDekat, iMudah), 100000000]);
        simRules.push([Math.min(m_kecil, iDekat, iSulit), 75000000]);
        simRules.push([Math.min(m_kecil, iJauh, iMudah), 75000000]);
        simRules.push([Math.min(m_kecil, iJauh, iSulit), 50000000]);

        simRules.push([Math.min(m_sedang, iDekat, iMudah), 200000000]);
        simRules.push([Math.min(m_sedang, iDekat, iSulit), 175000000]);
        simRules.push([Math.min(m_sedang, iJauh, iMudah), 175000000]);
        simRules.push([Math.min(m_sedang, iJauh, iSulit), 150000000]);

        simRules.push([Math.min(m_besar, iDekat, iMudah), 250000000]);
        simRules.push([Math.min(m_besar, iDekat, iSulit), 225000000]);
        simRules.push([Math.min(m_besar, iJauh, iMudah), 225000000]);
        simRules.push([Math.min(m_besar, iJauh, iSulit), 200000000]);

        // Defuzz
        let a = 0;
        let b = 0;
        simRules.forEach(r => { a += r[0] * r[1]; b += r[0]; });

        const rawPrice = (b !== 0) ? a / b : 0;

        // Apply Year Factor (Using same global logic or passed year)
        // Simulation graph usually implies "What if size changed NOW", so keep year constant as per User input or base?
        // Let's use the USER's year to make it relevant.
        return rawPrice * data.faktor;
    };

    renderInferenceChart('inferenceChart', data.luas, {
        lokasi: data.lokasi,
        akses: data.akses,
        currentOutput: data.harga_akhir
    }, simulationLogic);

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

function kategoriHarga(harga) {
    if (harga <= 75000000) return "Sangat Murah";
    if (harga <= 125000000) return "Murah";
    if (harga <= 175000000) return "Sedang";
    if (harga <= 225000000) return "Mahal";
    return "Sangat Mahal";
}
