
/* =================================
   1. DATA OBAT
================================= */

const dataAwal = [
    {id: 1, nama: "Paracetamol", kategori: "Tablet", harga: 5000, stok: 50},
    {id: 2, nama: "Vitamin C", kategori: "Vitamin", harga: 12000, stok: 35},
    {id: 3, nama: "OBH Combi", kategori: "Sirup", harga: 18000, stok: 20},
    {id: 4, nama: "Betadine", kategori: "Salep", harga: 15000, stok: 25},
    {id: 5, nama: "Amoxicillin", kategori: "Kapsul", harga: 10000, stok: 30},
    {id: 6, nama: "Antasida", kategori: "Tablet", harga: 6000, stok: 40},
    {id: 7, nama: "Promag", kategori: "Tablet", harga: 8000, stok: 15},
    {id: 8, nama: "Komix", kategori: "Sirup", harga: 12000, stok: 18},
    {id: 9, nama: "Vitamin B Complex", kategori: "Vitamin", harga: 11000, stok: 22},
    {id: 10, nama: "Salep Kulit", kategori: "Salep", harga: 9000, stok: 12},
    {id: 11, nama: "Cetirizine", kategori: "Tablet", harga: 7000, stok: 28},
    {id: 12, nama: "Antiseptik", kategori: "Lainnya", harga: 14000, stok: 16},
    {id: 13, nama: "Minyak Kayu Putih", kategori: "Lainnya", harga: 13000, stok: 24},
    {id: 14, nama: "Vitamin D", kategori: "Vitamin", harga: 16000, stok: 19},
    {id: 15, nama: "Masker Medis", kategori: "Lainnya", harga: 2000, stok: 100},
    {id: 16, nama: "Kasa Steril", kategori: "Lainnya", harga: 5000, stok: 40},
    {id: 17, nama: "Oralit", kategori: "Lainnya", harga: 4000, stok: 30},
    {id: 18, nama: "Hand Sanitizer", kategori: "Lainnya", harga: 17000, stok: 25}
];

let obat = JSON.parse(localStorage.getItem("apotekObat")) || dataAwal;
let keranjang = JSON.parse(localStorage.getItem("apotekCart")) || [];
let transaksi = JSON.parse(localStorage.getItem("apotekTransaksi")) || [];


/* =================================
   2. PENYIMPANAN DATA
================================= */

function simpanSemua() {
    localStorage.setItem("apotekObat", JSON.stringify(obat));
    localStorage.setItem("apotekCart", JSON.stringify(keranjang));
    localStorage.setItem("apotekTransaksi", JSON.stringify(transaksi));
}


/* =================================
   3. FORMAT RUPIAH
================================= */

function rupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

function aman(teks) {
    return String(teks).replace(/[&<>"']/g, karakter => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[karakter]);
}


/* =================================
   4. DASHBOARD
================================= */

function dashboard() {
    document.getElementById("totalObat").textContent = obat.length;

    let totalStok = obat.reduce(
        (total, item) => total + item.stok, 0
    );

    document.getElementById("totalStok").textContent = totalStok;

    let stokHampirHabis = obat.filter(
        item => item.stok <= 10
    ).length;

    document.getElementById("stokMenipis").textContent = stokHampirHabis;

    document.getElementById("totalTransaksi").textContent =
        transaksi.length;

    document.getElementById("jumlahCart").textContent =
        keranjang.reduce((total, item) => total + item.jumlah, 0);
}


/* =================================
   5. MENAMPILKAN OBAT
================================= */

function tampilkanObat() {
    let tabel = document.getElementById("tabelObat");

    let cari = document.getElementById("cariObat").value.toLowerCase();

    let kategori = document.getElementById("kategoriFilter").value;

    tabel.innerHTML = "";

    let hasil = obat.filter(item => {
        return item.nama.toLowerCase().includes(cari) &&
        (kategori === "Semua" || item.kategori === kategori);
    });

    if (hasil.length === 0) {
        tabel.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center">
                    Obat tidak ditemukan.
                </td>
            </tr>
        `;
    }

    hasil.forEach((item, index) => {

        let status = "";
        let kelas = "";

        if (item.stok === 0) {
            status = "Habis";
            kelas = "habis";
        } else if (item.stok <= 10) {
            status = "Menipis";
            kelas = "menipis";
        } else {
            status = "Tersedia";
            kelas = "aman";
        }

        tabel.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td><b>${aman(item.nama)}</b></td>
                <td>${aman(item.kategori)}</td>
                <td>${rupiah(item.harga)}</td>
                <td>${item.stok}</td>
                <td>
                    <span class="status ${kelas}">
                        ${status}
                    </span>
                </td>
                <td>
                    <button class="btn-edit"
                        onclick="editObat(${item.id})">
                        Edit
                    </button>

                    <button class="btn-delete"
                        onclick="hapusObat(${item.id})">
                        Hapus
                    </button>

                    <button class="btn-beli"
                        onclick="beliObat(${item.id})"
                        ${item.stok === 0 ? "disabled" : ""}>
                        Beli
                    </button>
                </td>
            </tr>
        `;
    });

    dashboard();
}


/* =================================
   6. TAMBAH BARANG
================================= */

function bukaTambah() {
    resetForm();

    document.getElementById("tambah").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("namaObat").focus();
}

document.getElementById("formObat").addEventListener("submit", function(e) {

    e.preventDefault();

    let id = document.getElementById("idObat").value;

    let nama = document.getElementById("namaObat").value.trim();

    let kategori = document.getElementById("kategoriObat").value;

    let harga = Number(document.getElementById("hargaObat").value);

    let stok = Number(document.getElementById("stokObat").value);

    if (!nama || !kategori ||
        !Number.isFinite(harga) || harga < 0 ||
        !Number.isSafeInteger(stok) || stok < 0) {

        alert("Mohon isi data dengan benar!");
        return;
    }

    if (id) {

        let index = obat.findIndex(
            item => item.id === Number(id)
        );

        if (index !== -1) {
            obat[index] = {
                id: Number(id),
                nama,
                kategori,
                harga,
                stok
            };
        }

        alert("Data obat berhasil diperbarui!");

    } else {

        let barangBaru = {
            id: Date.now(),
            nama,
            kategori,
            harga,
            stok
        };

        obat.push(barangBaru);

        alert("Barang berhasil ditambahkan!");
    }

    simpanSemua();
    tampilkanObat();
    resetForm();

});


/* =================================
   7. EDIT BARANG
================================= */

function editObat(id) {

    let item = obat.find(data => data.id === id);

    if (!item) return;

    document.getElementById("idObat").value = item.id;

    document.getElementById("namaObat").value = item.nama;

    document.getElementById("kategoriObat").value = item.kategori;

    document.getElementById("hargaObat").value = item.harga;

    document.getElementById("stokObat").value = item.stok;

    document.getElementById("judulForm").textContent = "Edit Barang";

    document.getElementById("tambah").scrollIntoView({
        behavior: "smooth"
    });
}


/* =================================
   8. HAPUS BARANG
================================= */

function hapusObat(id) {

    let konfirmasi = confirm(
        "Apakah kamu yakin ingin menghapus barang ini?"
    );

    if (!konfirmasi) return;

    obat = obat.filter(item => item.id !== id);

    keranjang = keranjang.filter(item => item.id !== id);

    simpanSemua();

    tampilkanObat();
    tampilkanKeranjang();

    alert("Barang berhasil dihapus!");
}


/* =================================
   9. RESET FORM
================================= */

function resetForm() {

    document.getElementById("formObat").reset();

    document.getElementById("idObat").value = "";

    document.getElementById("judulForm").textContent = "Tambah Barang";
}


/* =================================
   10. TAMBAH KE KERANJANG
================================= */

function beliObat(id) {

    let barang = obat.find(item => item.id === id);

    if (!barang || barang.stok <= 0) {
        alert("Stok barang sedang kosong!");
        return;
    }

    let item = keranjang.find(data => data.id === id);

    if (item) {

        if (item.jumlah >= barang.stok) {
            alert("Jumlah pembelian melebihi stok!");
            return;
        }

        item.jumlah++;

    } else {

        keranjang.push({
            id: id,
            jumlah: 1
        });

    }

    simpanSemua();
    tampilkanKeranjang();
    dashboard();

    alert(barang.nama + " berhasil ditambahkan ke keranjang!");
}


/* =================================
   11. MENAMPILKAN KERANJANG
================================= */

function tampilkanKeranjang() {

    let tabel = document.getElementById("tabelKeranjang");

    tabel.innerHTML = "";

    let total = 0;

    if (keranjang.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center">
                    Keranjang masih kosong.
                </td>
            </tr>
        `;
    }

    keranjang = keranjang.filter(item =>
        obat.some(barang => barang.id === item.id)
    );

    keranjang.forEach(item => {

        let barang = obat.find(data => data.id === item.id);

        if (!barang) return;

        let subtotal = barang.harga * item.jumlah;

        total += subtotal;

        tabel.innerHTML += `
            <tr>
                <td>${aman(barang.nama)}</td>

                <td>${rupiah(barang.harga)}</td>

                <td>
                    <button class="btn-jumlah"
                        onclick="ubahJumlah(${item.id}, -1)">−</button>

                    ${item.jumlah}

                    <button class="btn-jumlah"
                        onclick="ubahJumlah(${item.id}, 1)">+</button>
                </td>

                <td>${rupiah(subtotal)}</td>

                <td>
                    <button class="btn-delete"
                        onclick="hapusCart(${item.id})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalHarga").textContent =
        rupiah(total);

    dashboard();
}


/* =================================
   12. UBAH JUMLAH PEMBELIAN
================================= */

function ubahJumlah(id, perubahan) {

    let item = keranjang.find(data => data.id === id);

    let barang = obat.find(data => data.id === id);

    if (!item || !barang) return;

    let jumlahBaru = item.jumlah + perubahan;

    if (jumlahBaru <= 0) {
        hapusCart(id);
        return;
    }

    if (jumlahBaru > barang.stok) {
        alert("Stok tidak mencukupi!");
        return;
    }

    item.jumlah = jumlahBaru;

    simpanSemua();

    tampilkanKeranjang();
}


/* =================================
   13. HAPUS DARI KERANJANG
================================= */

function hapusCart(id) {

    keranjang = keranjang.filter(
        item => item.id !== id
    );

    simpanSemua();

    tampilkanKeranjang();
}


/* =================================
   14. CHECKOUT
================================= */

function checkout() {

    let nama = document.getElementById("namaPembeli")
        .value.trim();

    if (!nama) {
        alert("Silakan masukkan nama pembeli!");
        return;
    }

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    // PERIKSA KETERSEDIAAN STOK
    for (let item of keranjang) {

        let barang = obat.find(data => data.id === item.id);

        if (!barang || barang.stok < item.jumlah) {
            alert("Stok salah satu barang tidak mencukupi!");
            return;
        }
    }

    let total = 0;
    let rincian = [];

    // HITUNG TRANSAKSI
    keranjang.forEach(item => {

        let barang = obat.find(data => data.id === item.id);

        let subtotal = barang.harga * item.jumlah;

        total += subtotal;

        rincian.push({
            nama: barang.nama,
            jumlah: item.jumlah,
            harga: barang.harga,
            subtotal: subtotal
        });

        barang.stok -= item.jumlah;
    });

    let kode = "APT-" + Date.now();

    let tanggal = new Date().toLocaleString("id-ID");

    // SIMPAN RIWAYAT
    transaksi.unshift({
        kode: kode,
        nama: nama,
        tanggal: tanggal,
        total: total,
        rincian: rincian
    });

    keranjang = [];

    simpanSemua();

    tampilkanObat();
    tampilkanKeranjang();
    tampilkanRiwayat();

    document.getElementById("namaPembeli").value = "";

    alert(
        "CHECKOUT BERHASIL!\n\n" +
        "Kode: " + kode + "\n" +
        "Pembeli: " + nama + "\n" +
        "Total: " + rupiah(total) +
        "\n\nIni adalah transaksi simulasi. " +
        "Belum ada pembayaran sungguhan."
    );

    document.getElementById("riwayat").scrollIntoView({
        behavior: "smooth"
    });
}


/* =================================
   15. RIWAYAT TRANSAKSI
================================= */

function tampilkanRiwayat() {

    let tabel = document.getElementById("tabelRiwayat");

    tabel.innerHTML = "";

    if (transaksi.length === 0) {

        tabel.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center">
                    Belum ada transaksi.
                </td>
            </tr>
        `;

        return;
    }

    transaksi.forEach((item, index) => {

        tabel.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${aman(item.kode)}</td>
                <td>${aman(item.nama)}</td>
                <td>${aman(item.tanggal)}</td>
                <td><b>${rupiah(item.total)}</b></td>
            </tr>
        `;
    });
}


/* =================================
   16. JALANKAN WEBSITE
================================= */

tampilkanObat();
tampilkanKeranjang();
tampilkanRiwayat();
dashboard();

