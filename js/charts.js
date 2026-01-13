// --- Chart.js Implementations for Fuzzy Logic Visualization ---

////// 1. Grafik Fungsi Keanggotaan (Membership Functions)

// 2. Grafik Aktivasi Rule (Bar Chart)
function renderRuleChart(canvasId, rules) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    // Filter out rules with 0 activation for cleaner view, or show all? 
    // User req: "Hanya rule yang aktif (>0) yang ditampilkan atau diberi warna berbeda"
    // Let's show active ones primarily. 

    const activeRules = rules.map((r, i) => ({ index: i + 1, alpha: r[0], z: r[1] }))
        .filter(r => r.alpha > 0);

    // If no rules active (shouldn't happen), show valid message or empty chart
    if (activeRules.length === 0) return;

    const labels = activeRules.map(r => `Rule ${r.index}`);
    const dataAlpha = activeRules.map(r => r.alpha);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Nilai Aktivasi (α-predikat)',
                data: dataAlpha,
                backgroundColor: 'rgba(99, 102, 241, 0.6)', // Primary Color
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Aktivasi Rule (Rules yang Aktif)'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1.0,
                    title: {
                        display: true,
                        text: 'Firing Strength (α)'
                    }
                }
            }
        }
    });
}

// 3. Grafik Perbandingan Input vs Output (Inference Simulation)
// This requires re-running the logic for a range of inputs to generate the curve.
// We need to pass the calculation parameters (Lokasi, Akses) to simulate.
function renderInferenceChart(canvasId, currentInput, contextData, calcFunction) {
    const ctx = document.getElementById(canvasId).getContext('2d');

    const labels = [];
    const prices = [];

    // Simulate calc for range 50 to 450
    for (let x = 50; x <= 450; x += 10) {
        labels.push(x);
        // Call the passed calculation logic simulation
        // We need a way to invoke the fuzzy logic engine without full DOM dependency.
        // We will assume calcFunction takes (luas, lokasi, akses) and returns {harga_fuzzy}
        const result = calcFunction(x, contextData.lokasi, contextData.akses);
        prices.push(result);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Estimasi Harga (Fuzzy)',
                data: prices,
                borderColor: '#8b5cf6', // Violet
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                fill: true,
                tension: 0.4, // Smooth curve
                pointRadius: 0,
                pointHoverRadius: 6
            },
            {
                label: 'Posisi Anda',
                data: labels.map(l => l === Math.round(currentInput / 10) * 10 ? contextData.currentOutput : null), // Hacky point mapping
                // Better way: scatter point overlay
                type: 'scatter',
                backgroundColor: 'red',
                pointRadius: 6,
                pointStyle: 'circle'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: ` Simulasi Harga vs Luas (${contextData.lokasi}, ${contextData.akses})`
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `Rp ${new Intl.NumberFormat('id-ID').format(context.raw)}`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        point1: {
                            type: 'point',
                            xValue: labels.indexOf(Math.round(currentInput / 10) * 10), // This index mapping is fragile.
                            // Chart.js mixed type with line+scatter works best with Linear Scale for X.
                            // Let's stick to simple line for now, maybe add a vertical line annotation for user input.
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Luas Tanah (m²)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Estimasi Harga (Rp)'
                    }
                }
            }
        }
    });

    // Note: To do a proper Point on Line chart with Chart.js using categories labels is tricky.
    // Switching X axis to 'linear' scale would be better but requires dataset {x,y} structure.
    // For simplicity of implementation matching the requirement "Titik input pengguna", I'll add an annotation line.
}
