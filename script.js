// Data lima mempelai (array of object)
const mempelai = [
  { nama: "Ichika Nakano",  urutan: "Anak pertama", warna: "#e9b824", sifat: "Dewasa, suka menggoda, dan selalu menjaga adik-adiknya.", hobi: "Berakting" },
  { nama: "Nino Nakano",    urutan: "Anak kedua",   warna: "#e0508a", sifat: "Blak-blakan, pandai memasak, dan Tsundere.", hobi: "Memasak dan membuat kue" },
  { nama: "Miku Nakano",    urutan: "Anak ketiga",  warna: "#4a6fd8", sifat: "Pendiam, tekun, dan setia pada hal yang ia sukai.", hobi: "Mendengarkan musik dan membaca sejarah" },
  { nama: "Yotsuba Nakano", urutan: "Anak keempat", warna: "#3fa760", sifat: "Ceria, energik, dan selalu siap membantu siapa saja.", hobi: "Olahraga" },
  { nama: "Itsuki Nakano",  urutan: "Anak kelima",  warna: "#e0472f", sifat: "Serius, bertanggung jawab, dan punya nafsu makan besar.", hobi: "Makan dan belajar" }
];

const tombol = document.querySelectorAll(".face");
const wadah = document.getElementById("faces");
const kartu = document.getElementById("profil");

function tampilkanProfil(i) {
  const m = mempelai[i];
  tombol.forEach((t, idx) => t.classList.toggle("active", idx === i));
  wadah.classList.add("has-active");
  kartu.style.setProperty("--aksen", m.warna);
  kartu.innerHTML = `
    <div class="card-body">
      <h2 class="h4 mb-1">${m.nama}</h2>
      <p class="text-muted mb-2">${m.urutan}</p>
      <p class="mb-1">${m.sifat}</p>
      <p class="mb-0"><strong>Hobi:</strong> ${m.hobi}</p>
    </div>`;
}

tombol.forEach((t, i) => t.addEventListener("click", () => tampilkanProfil(i)));

// Countdown ke hari H (ubah tanggalnya di sini)
const hariH = new Date("2026-12-26T10:00:00+07:00");
const hitung = document.getElementById("countdown");

function perbaruiCountdown() {
  const selisih = hariH - new Date();
  if (selisih <= 0) {
    hitung.innerHTML = "<p>Hari bahagia telah tiba!</p>";
    return;
  }
  const hari = Math.floor(selisih / 86400000);
  const jam = Math.floor(selisih / 3600000) % 24;
  const menit = Math.floor(selisih / 60000) % 60;
  const detik = Math.floor(selisih / 1000) % 60;
  hitung.innerHTML = [["Hari", hari], ["Jam", jam], ["Menit", menit], ["Detik", detik]]
    .map(([label, nilai]) => `<div class="kotak"><strong>${nilai}</strong>${label}</div>`)
    .join("");
}
perbaruiCountdown();
setInterval(perbaruiCountdown, 1000);

// ===== Cover & musik =====
const cover = document.getElementById("cover");
const musik = document.getElementById("musik");
const btnMusik = document.getElementById("btnMusik");
musik.volume = 0.5;

function putarMusik() {
  musik.play()
    .then(() => { btnMusik.textContent = "♪ Jeda"; })
    .catch(() => { /* file audio belum ada / diblokir browser */ });
}

document.getElementById("btnBuka").addEventListener("click", () => {
  cover.classList.add("tutup");
  document.body.classList.remove("terkunci");
  putarMusik();
});

btnMusik.addEventListener("click", () => {
  if (musik.paused) {
    putarMusik();
  } else {
    musik.pause();
    btnMusik.textContent = "♪ Putar";
  }
});

// ===== RSVP =====
const formRsvp = document.getElementById("formRsvp");
const daftarUcapan = document.getElementById("daftarUcapan");
let daftarRsvp = [];

try { daftarRsvp = JSON.parse(localStorage.getItem("rsvpNakano")) || []; } catch (e) { daftarRsvp = []; }

// Mencegah teks tamu dibaca sebagai HTML
const aman = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function tampilkanRsvp() {
  if (daftarRsvp.length === 0) {
    daftarUcapan.innerHTML = '<p class="text-center text-muted">Belum ada ucapan.</p>';
    return;
  }
  daftarUcapan.innerHTML = daftarRsvp.map((r) => `
    <div class="card card-body mb-2">
      <div><strong>${aman(r.nama)}</strong>
        <span class="badge ${r.hadir === "Hadir" ? "text-bg-success" : "text-bg-secondary"}">${r.hadir}${r.hadir === "Hadir" ? ` (${r.jumlah} orang)` : ""}</span></div>
      ${r.ucapan ? `<p class="mb-0 mt-1">${aman(r.ucapan)}</p>` : ""}
    </div>`).join("");
}

formRsvp.addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = document.getElementById("nama");
  const kehadiran = document.getElementById("kehadiran");
  const jumlah = document.getElementById("jumlah");
  const ucapan = document.getElementById("ucapan");
  const n = parseInt(jumlah.value);

  const cek = [
    [nama, nama.value.trim() !== ""],
    [kehadiran, kehadiran.value !== ""],
    [jumlah, n >= 1 && n <= 5]
  ];
  cek.forEach(([input, ok]) => input.classList.toggle("is-invalid", !ok));
  if (cek.some(([, ok]) => !ok)) return; // hentikan jika ada yang tidak valid

  daftarRsvp.unshift({ nama: nama.value.trim(), hadir: kehadiran.value, jumlah: n, ucapan: ucapan.value.trim() });
  try { localStorage.setItem("rsvpNakano", JSON.stringify(daftarRsvp)); } catch (e) { /* abaikan */ }
  tampilkanRsvp();
  formRsvp.reset();
  jumlah.value = 1;
});

tampilkanRsvp();

const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function buatKelopak() {
  const k = document.createElement("div");
  k.className = "kelopak";
  const ukuran = 10 + Math.random() * 12;   // 10-22 px
  const durasi = 7 + Math.random() * 6;     // 7-13 detik
  k.style.width = ukuran + "px";
  k.style.height = ukuran * 0.75 + "px";
  k.style.left = Math.random() * 100 + "vw";
  k.style.animationDuration = durasi + "s";
  k.style.setProperty("--goyang", (Math.random() * 120 - 60) + "px");
  document.body.appendChild(k);
  setTimeout(() => k.remove(), durasi * 1000);   // hapus setelah mendarat
}

if (!kurangiGerak) setInterval(buatKelopak, 600);