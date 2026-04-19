// ==========================================
// 🤖 2. KİŞİ: OYUN MOTORU (GÜNCELLENMİŞ)
// ==========================================

let komutKuyrugu = [];
let karakterPozisyon = { x: 0, z: 0 };
let karakterYon = 0;

// Elementler
const btnIleri = document.getElementById("btn-ileri");
const btnSag = document.getElementById("btn-sag");
const btnSol = document.getElementById("btn-sol");
const btnCalistir = document.getElementById("btn-calistir");
const kodAkisiPanel = document.getElementById("kod-akisi");
const bipBopMesaj = document.getElementById("bipbop-mesaj");

// Dinleyiciler
if (btnIleri) btnIleri.addEventListener("click", () => komutEkle("ileri"));
if (btnSag) btnSag.addEventListener("click", () => komutEkle("sağa dön"));
if (btnSol) btnSol.addEventListener("click", () => komutEkle("sola dön"));
if (btnCalistir) btnCalistir.addEventListener("click", algoritmayiCalistir);

// Komut Ekleme
function komutEkle(komut) {
  komutKuyrugu.push(komut);
  const yeniKomutSatiri = document.createElement("div");
  yeniKomutSatiri.className =
    "badge bg-info text-dark m-1 p-2 d-block text-start border border-light";
  yeniKomutSatiri.innerHTML = `⚙️ ${komut.toUpperCase()}`;
  kodAkisiPanel.appendChild(yeniKomutSatiri);
  bipBopMesaj.innerText = `Harika! "${komut}" komutunu hafızaya aldım Kaptan!`;
}

// Algoritmayı Çalıştır (Her adımda kontrol eder)
function algoritmayiCalistir() {
  if (komutKuyrugu.length === 0) {
    bipBopMesaj.innerText = "🤖: Kaptan, önce bir rota oluşturmalısın!";
    return;
  }

  btnCalistir.disabled = true;
  bipBopMesaj.innerText = "🤖: Sistem devrede! Rota takip ediliyor...";

  const calistirmaDongusu = setInterval(() => {
    // Eğer komutlar bittiyse durdur
    if (komutKuyrugu.length === 0) {
      clearInterval(calistirmaDongusu);
      btnCalistir.disabled = false;
      bipBopMesaj.innerText = "🤖: Rota bitti ama henüz parçayı bulamadık.";
      return;
    }

    const aktifKomut = komutKuyrugu.shift();
    mantiksalHesaplama(aktifKomut);

    // 🚩 Her adımda kontrol: Parçayı bulursak DUR!
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

// Koordinat Hesaplama
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
    `Konum: [X: ${karakterPozisyon.x}, Z: ${karakterPozisyon.z}] | Açı: ${karakterYon}`,
  );

  if (window.karakteri3DHareketEttir) {
    window.karakteri3DHareketEttir(karakterPozisyon, karakterYon);
  }
}

// Hedef Kontrolü
function hedefKontrol() {
  const hedef = { x: 2, z: 2 };

  if (karakterPozisyon.x === hedef.x && karakterPozisyon.z === hedef.z) {
    bipBopMesaj.innerText = "🤖: MÜKEMMEL! Parçayı bulduk!";
    if (window.soruEkraniAc) {
      window.soruEkraniAc();
    }
    return true;
  }
  return false;
}
