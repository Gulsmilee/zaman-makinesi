// ==========================================
// 🤖 2. KİŞİ: OYUN MOTORU (SEVİYE DESTEKLİ)
// ==========================================

// 1. DEĞİŞKENLER VE SEVİYE HEDEFLERİ
let komutKuyrugu = [];
let karakterPozisyon = { x: 0, z: 0 };
let karakterYon = 0;

// Her seviyenin hedef koordinatlarını burada tutuyoruz
const SEVIYE_HEDEFLERI = [
  { x: 2, z: 2 }, // 0: Dinozorlar Çağı
  { x: 3, z: 1 }, // 1: Antik Mısır
  { x: 1, z: 4 }, // 2: Uzay İstasyonu
];

// 2. HTML ELEMENTLERİNE ERİŞİM
const btnIleri = document.getElementById("btn-ileri");
const btnSag = document.getElementById("btn-sag");
const btnSol = document.getElementById("btn-sol");
const btnCalistir = document.getElementById("btn-calistir");
const kodAkisiPanel = document.getElementById("kod-akisi");
const bipBopMesaj = document.getElementById("bipbop-mesaj");

// 3. BUTON DİNLEYİCİLERİ
// motor.js içinde buton dinleyicilerini bul ve şu satırı ekle:
if (btnIleri)
  btnIleri.addEventListener("click", () => {
    komutEkle("ileri");
    if (window.tiklamaSesi) window.tiklamaSesi(); //  Tık sesi!
  });

if (btnSag)
  btnSag.addEventListener("click", () => {
    komutEkle("sağa dön");
    if (window.tiklamaSesi) window.tiklamaSesi(); //  Tık sesi!
  });

if (btnSol)
  btnSol.addEventListener("click", () => {
    komutEkle("sola dön");
    if (window.tiklamaSesi) window.tiklamaSesi(); //  Tık sesi!
  });
if (btnCalistir) btnCalistir.addEventListener("click", algoritmayiCalistir);

// 4. KOMUT EKLEME
function komutEkle(komut) {
  komutKuyrugu.push(komut);
  const yeniKomutSatiri = document.createElement("div");
  yeniKomutSatiri.className =
    "badge bg-info text-dark m-1 p-2 d-block text-start border border-light";
  yeniKomutSatiri.innerHTML = `⚙️ ${komut.toUpperCase()}`;
  kodAkisiPanel.appendChild(yeniKomutSatiri);
  bipBopMesaj.innerText = `Kaptan, "${komut}" hafızaya alındı!`;
}

// 5. ALGORİTMAYI ÇALIŞTIRMA
function algoritmayiCalistir() {
  if (komutKuyrugu.length === 0) {
    bipBopMesaj.innerText = "🤖: Kaptan, önce bir rota oluşturmalısın!";
    return;
  }

  btnCalistir.disabled = true;
  bipBopMesaj.innerText = "🤖: Sistem devrede! Rota takip ediliyor...";

  const calistirmaDongusu = setInterval(() => {
    if (komutKuyrugu.length === 0) {
      clearInterval(calistirmaDongusu);
      btnCalistir.disabled = false;
      bipBopMesaj.innerText = "🤖: Rota bitti ama hedefi henüz bulamadık.";
      return;
    }

    const aktifKomut = komutKuyrugu.shift();
    mantiksalHesaplama(aktifKomut);

    // Her adımda hedefi kontrol et
    if (hedefKontrol()) {
      clearInterval(calistirmaDongusu);
      btnCalistir.disabled = false;
      return;
    }

    if (kodAkisiPanel.firstChild) {
      kodAkisiPanel.removeChild(kodAkisiPanel.firstChild);
    }
  }, 1000);
}

// 6. KOORDİNAT HESAPLAMA
function mantiksalHesaplama(komut) {
  if (komut === "ileri") {
    if (karakterYon === 0) karakterPozisyon.z++;
    if (karakterYon === 90) karakterPozisyon.x++;
    if (karakterYon === 180) karakterPozisyon.z--;
    if (karakterYon === 270) karakterPozisyon.x--;
  } else if (komut === "sağa dön") {
    karakterYon = (karakterYon + 90) % 360;
  } else if (komut === "sola dön") {
    karakterYon = (karakterYon + 270) % 360;
  }

  console.log(
    `Konum: [X: ${karakterPozisyon.x}, Z: ${karakterPozisyon.z}] | Seviye: ${window.mevcutSeviyeIndeksi || 0}`,
  );

  if (window.karakteri3DHareketEttir) {
    window.karakteri3DHareketEttir(karakterPozisyon, karakterYon);
  }
}

// 7. HEDEF KONTROLÜ (Seviyeye Duyarlı)
function hedefKontrol() {
  // Bulmaca.js'deki değişkeni oku, yoksa 0 kabul et
  let guncelSeviye = window.mevcutSeviyeIndeksi || 0;
  const hedef = SEVIYE_HEDEFLERI[guncelSeviye];

  if (karakterPozisyon.x === hedef.x && karakterPozisyon.z === hedef.z) {
    bipBopMesaj.innerText = "🤖: MÜKEMMEL! Parçayı bulduk!";
    if (window.soruEkraniAc) window.soruEkraniAc();
    return true;
  }
  return false;
}

// 8. YENİ SEVİYEYE HAZIRLIK (Sıfırlama)
window.yeniSeviyeyeHazirlan = function () {
  //  IŞINLANMA EFEKTİNİ TETİKLE!
  if (window.isinlanmaEfekti) window.isinlanmaEfekti();

  karakterPozisyon = { x: 0, z: 0 };
  karakterYon = 0;
  kodAkisiPanel.innerHTML = "";
  komutKuyrugu = [];

  // Artık mesajı Bip-Bop'un havalı yazma efektiyle verelim
  if (window.bipBopYaz) {
    window.bipBopYaz("Zaman sıçraması başarılı! Yeni parça aranıyor...");
  } else {
    bipBopMesaj.innerText = "🤖: Zaman sıçraması başarılı!";
  }
};
