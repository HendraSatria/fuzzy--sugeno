// Validasi sederhana (opsional)
document.querySelector("form")?.addEventListener("submit", function(e){
    let luas = document.querySelector("input[name='luas']").value;
    if(luas <= 0){
        alert("Luas tanah harus lebih dari 0");
        e.preventDefault();
    }
});
