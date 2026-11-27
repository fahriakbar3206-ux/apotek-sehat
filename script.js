
let obat = JSON.parse(localStorage.getItem("obat")) || [
    {id: 1, nama: "Paracetamol", kategori: "Obat Tablet", harga: 5000, stok: 50},
    {id: 2, nama: "Amoxicillin", kategori: "Obat Tablet", harga: 12000, stok: 30},
    {id: 3, nama: "Promag", kategori: "Obat Tablet", harga: 8000, stok: 40},
    {id: 4, nama: "Bodrex", kategori: "Obat Tablet", harga: 4000, stok: 45},
    {id: 5, nama: "Antangin", kategori: "Obat Cair", harga: 3500, stok: 35},
    {id: 6, nama: "OBH Combi", kategori: "Obat Cair", harga: 15000, stok: 20},
    {id: 7, nama: "Betadine", kategori: "Perawatan", harga: 18000, stok: 25},
    {id: 8, nama: "Vitamin C", kategori: "Vitamin", harga: 10000, stok: 50},
    {id: 9, nama: "Vitamin B Complex", kategori: "Vitamin", harga: 12000, stok: 30},
    {id: 10, nama: "Minyak Kayu Putih", kategori: "Perawatan", harga: 14000, stok: 25},
    {id: 11, nama: "Hansaplast", kategori: "Perawatan", harga: 6000, stok: 60},
    {id: 12, nama: "Masker Medis", kategori: "Alat Kesehatan", harga: 15000, stok: 40},
    {id: 13, nama: "Termometer", kategori: "Alat Kesehatan", harga: 35000, stok: 15},
    {id: 14, nama: "Alkohol 70%", kategori: "Perawatan", harga: 10000, stok: 30},
    {id: 15, nama: "Oralit", kategori: "Obat Cair", harga: 3000, stok: 50},
    {id: 16, nama: "Tolak Angin", kategori: "Obat Cair", harga: 4000, stok: 40},
    {id: 17, nama: "Kapas Medis", kategori: "Alat Kesehatan", harga: 8000, stok: 25},
    {id: 18, nama: "Vitamin D", kategori: "Vitamin", harga: 20000, stok: 20}
];

let keranjang = JSON.parse(localStorage.getItem("keranjang")) || [];
let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

function simpanSemua() {
    localStorage.setItem("obat", JSON.stringify(obat));
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
    localStorage.setItem("transaksi", JSON.stringify(transaksi));
}

function rupiah(angka) {
    return "Rp" + Number(angka).toLocaleString("id-ID");
}

function dashboard() {
    document.getElementById("totalObat").textContent = obat.length;
    document.getElementById("totalStok").textContent =
        obat.reduce((total, item) => total + Number(item.stok), 0);

    document.getElementById("totalTransaksi").textContent = transaksi.length;
    document.getElementById("totalPesanan").textContent =
        transaksi.filter(item => item.status === "Menunggu Konfirmasi").length;
}

function tampilkanObat() {
    const tempat = document.getElementById("daftarObat");
    const cari = document.getElementById("cariObat").value.toLowerCase();
    const kategori = document.getElementById("filterKategori").value;

    const hasil = obat.filter(item =>
        item.nama.toLowerCase().includes(cari) &&
        (kategori === "" || item.kategori === kategori)
    );

    tempat.innerHTML = "";

    if (hasil.length === 0) {
        tempat.innerHTML = "<p>Obat tidak ditemukan.</p>";
    }

    hasil.forEach(item => {
        tempat.innerHTML += `
            <div class="product-card">
                <div class="product-icon">💊</div>
                <h3>${item.nama}</h3>
                <p>${item.kategori}</p>
                <p class="price">${rupiah(item.harga)}</p>
                <p>Stok: ${item.stok}</p>

                <button onclick="tambahKeranjang(${item.id})"
                    ${item.stok <= 0 ? "disabled" : ""}>
                    ${item.stok <= 0 ? "Stok Habis" : "Tambah Keranjang"}
                </button>

                <div class="action-buttons">
                    <button class="edit-btn" onclick="editObat(${item.id})">Edit</button>
                    <button class="delete-btn" onclick="hapusObat(${item.id})">Hapus</button>
                </div>
            </div>
        `;
    });
}

function simpanObat() {
    const id = document.getElementById("editId").value;
    const nama = document.getElementById("namaObat").value.trim();
    const kategori = document.getElementById("kategoriObat").value;
    const harga = Number(document.getElementById("hargaObat").value);
    const stok = Number(document.getElementById("stokObat").value);

    if (!nama || !kategori || harga <= 0 || stok < 0 ||
        document.getElementById("hargaObat").value === "" ||
        document.getElementById("stokObat").value === "") {
        alert("Lengkapi data obat dengan benar!");
        return;
    }

    if (id) {
        const index = obat.findIndex(item => item.id === Number(id));

        if (index !== -1) {
            obat[index] = {id: Number(id), nama, kategori, harga, stok};
        }
    } else {
        obat.push({
            id: Date.now(),
            nama,
            kategori,
            harga,
            stok
        });
    }

    resetForm();
    simpanSemua();
    tampilkanObat();
    dashboard();
    alert("Data obat berhasil disimpan!");
}

function editObat(id) {
    const item = obat.find(item => item.id === id);

    if (!item) return;

    document.getElementById("editId").value = item.id;
    document.getElementById("namaObat").value = item.nama;
    document.getElementById("kategoriObat").value = item.kategori;
    document.getElementById("hargaObat").value = item.harga;
    document.getElementById("stokObat").value = item.stok;

    document.getElementById("obat").scrollIntoView();
}

function hapusObat(id) {
    if (!confirm("Yakin ingin menghapus obat ini?")) return;

    obat = obat.filter(item => item.id !== id);
    keranjang = keranjang.filter(item => item.id !== id);

    simpanSemua();
    tampilkanObat();
    tampilkanKeranjang();
    dashboard();
}

function resetForm() {
    document.getElementById("editId").value = "";
    document.getElementById("namaObat").value = "";
    document.getElementById("kategoriObat").value = "";
    document.getElementById("hargaObat").value = "";
    document.getElementById("stokObat").value = "";
}

function tambahKeranjang(id) {
    const item = obat.find(item => item.id === id);
    if (!item || item.stok <= 0) {
        alert("Stok obat tidak tersedia!");
        return;
    }

    const ada = keranjang.find(item => item.id === id);

    if (ada) {
        if (ada.jumlah >= item.stok) {
            alert("Jumlah melebihi stok!");
            return;
        }
        ada.jumlah++;
    } else {
        keranjang.push({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: 1
        });
    }

    simpanSemua();
    tampilkanKeranjang();
    alert("Obat berhasil ditambahkan!");
}

function ubahJumlah(id, perubahan) {
    const item = keranjang.find(item => item.id === id);
    const dataObat = obat.find(item => item.id === id);

    if (!item || !dataObat) return;

    if (perubahan > 0 && item.jumlah >= dataObat.stok) {
        alert("Jumlah melebihi stok!");
        return;
    }

    item.jumlah += perubahan;

    if (item.jumlah <= 0) {
        keranjang = keranjang.filter(item => item.id !== id);
    }

    simpanSemua();
    tampilkanKeranjang();
}

function hapusDariKeranjang(id) {
    keranjang = keranjang.filter(item => item.id !== id);
    simpanSemua();
    tampilkanKeranjang();
}

function tampilkanKeranjang() {
    const tempat = document.getElementById("isiKeranjang");
    let total = 0;

    tempat.innerHTML = "";

    if (keranjang.length === 0) {
        tempat.innerHTML = "<p>Keranjang masih kosong.</p>";
    }

    keranjang.forEach(item => {
        const subtotal = item.harga * item.jumlah;
        total += subtotal;

        tempat.innerHTML += `
            <div class="cart-item">
                <div>
                    <h3>${item.nama}</h3>
                    <p>${rupiah(item.harga)} x ${item.jumlah}</p>
                    <strong>${rupiah(subtotal)}</strong>
                </div>

                <div class="action-buttons">
                    <button onclick="ubahJumlah(${item.id}, -1)">-</button>
                    <button onclick="ubahJumlah(${item.id}, 1)">+</button>
                    <button class="delete-btn"
                        onclick="hapusDariKeranjang(${item.id})">Hapus</button>
                </div>
            </div>
        `;
    });

    document.getElementById("totalHarga").textContent = rupiah(total);
    dashboard();
}

function checkout() {
    const nama = document.getElementById("namaPembeli").value.trim();
    const nomor = document.getElementById("nomorHP").value.trim();
    const alamat = document.getElementById("alamatPembeli").value.trim();
    const metode = document.getElementById("metodePembayaran").value;

    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    if (!nama || !nomor || !alamat) {
        alert("Lengkapi nama, nomor HP, dan alamat!");
        return;
    }

    if (!/^[0-9+\-\s]{8,16}$/.test(nomor)) {
        alert("Nomor HP tidak valid!");
        return;
    }

    for (const item of keranjang) {
        const dataObat = obat.find(data => data.id === item.id);

        if (!dataObat || dataObat.stok < item.jumlah) {
            alert("Stok " + item.nama + " tidak mencukupi!");
            return;
        }
    }

    const total = keranjang.reduce(
        (jumlah, item) => jumlah + item.harga * item.jumlah, 0
    );

    const rincian = keranjang.map(item => ({
        nama: item.nama,
        harga: item.harga,
        jumlah: item.jumlah
    }));

    keranjang.forEach(item => {
        const dataObat = obat.find(data => data.id === item.id);
        dataObat.stok -= item.jumlah;
    });

    transaksi.push({
        kode: "TRX-" + Date.now(),
        nama,
        nomor,
        alamat,
        metode,
        total,
        rincian,
        tanggal: new Date().toLocaleString("id-ID"),
        status: "Menunggu Konfirmasi"
    });

    keranjang = [];

    simpanSemua();
    tampilkanObat();
    tampilkanKeranjang();
    tampilkanRiwayat();
    dashboard();

    document.getElementById("namaPembeli").value = "";
    document.getElementById("nomorHP").value = "";
    document.getElementById("alamatPembeli").value = "";

    alert(
        "Pesanan berhasil dibuat!\n" +
        "Pembayaran: COD\n" +
        "Total: " + rupiah(total) +
        "\nSilakan tunggu konfirmasi pesanan."
    );
}

function tampilkanRiwayat() {
    const tempat = document.getElementById("tabelRiwayat");

    tempat.innerHTML = "";

    if (transaksi.length === 0) {
        tempat.innerHTML =
            '<tr><td colspan="7">Belum ada transaksi.</td></tr>';
        return;
    }

    transaksi.slice().reverse().forEach((item, index) => {
        tempat.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.kode}</td>
                <td>${item.nama}<br>${item.nomor}</td>
                <td>${item.alamat}</td>
                <td>${item.metode}</td>
                <td>${rupiah(item.total)}</td>
                <td>${item.status}</td>
            </tr>
        `;
    });
}

document.getElementById("cariObat").addEventListener("input", tampilkanObat);
document.getElementById("filterKategori").addEventListener("change", tampilkanObat);

function mulaiWebsite() {
    tampilkanObat();
    tampilkanKeranjang();
    tampilkanRiwayat();
    dashboard();
}

mulaiWebsite();
