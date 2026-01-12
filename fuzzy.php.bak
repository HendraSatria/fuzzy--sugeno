<?php
function kecil($x) {
    if ($x <= 100) return 1;
    if ($x > 100 && $x < 150) return (150 - $x) / 50;
    return 0;
}

function sedang($x) {
    if ($x == 150 || $x == 300) return 1; // batas masuk
    if ($x > 150 && $x < 225) return ($x - 150) / 75;
    if ($x >= 225 && $x < 300) return (300 - $x) / 75;
    return 0;
}

function besar($x) {
    if ($x == 300) return 1; // batas bawah besar
    if ($x > 300 && $x < 425) return ($x - 300) / 125;
    if ($x >= 425) return 1;
    return 0;
}

function lokasi($x) {
    return ($x == "dekat") ? 1 : 0.5;
}

function akses($x) {
    return ($x == "mudah") ? 1 : 0.5;
}
