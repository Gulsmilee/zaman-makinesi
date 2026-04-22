let komutKuyrugu = [];
let karakterPozisyon = { x: 0, z: 0 };
let karakterYon = 0;

<<<<<<< HEAD
window.engineState = {
    currentPos: { x: 0, z: 0 },
    targetPos: { x: 0, z: 0 },
    currentRot: 0,
    targetRot: 0
};

=======
>>>>>>> a88738f1bce31aa7d6b9aaf9c359bbb00a29d2e1
const btnIleri = document.getElementById("btn-ileri");
const btnSag = document.getElementById("btn-sag");
const btnSol = document.getElementById("btn-sol");
const btnCalistir = document.getElementById("btn-calistir");
const kodAkisiPanel = document.getElementById("kod-akisi");
const bipBopMesaj = document.getElementById("bipbop-mesaj");

if (btnIleri) btnIleri.addEventListener("click", () => komutEkle("ileri"));
if (btnSag) btnSag.addEventListener("click", () => komutEkle("sağa dön"));
if (btnSol) btnSol.addEventListener("click", () => komutEkle("sola dön"));
if (btnCalistir) btnCalistir.addEventListener("click", algoritmayiCalistir);

<<<<<<< HEAD
const btnTemizle = document.getElementById("btn-temizle");
if (btnTemizle) {
  btnTemizle.addEventListener("click", () => {
    if (window.algoritmayiTemizle) window.algoritmayiTemizle();
  });
}

const btnSil = document.getElementById("btn-sil");
if (btnSil) {
  btnSil.addEventListener("click", () => {
    if (komutKuyrugu.length > 0) {
      komutKuyrugu.pop();
      if (kodAkisiPanel.lastChild) {
        kodAkisiPanel.removeChild(kodAkisiPanel.lastChild);
      }
      bipBopMesaj.innerText = "🤖: Son komut silindi!";
    }
  });
}

window.algoritmayiTemizle = function() {
  komutKuyrugu = [];
  if (kodAkisiPanel) kodAkisiPanel.innerHTML = "";
  karakterPozisyon = { x: 0, z: 0 };
  karakterYon = 0;
  if (window.karakteri3DHareketEttir) {
    window.karakteri3DHareketEttir(karakterPozisyon, karakterYon);
  }
  if (btnCalistir) btnCalistir.disabled = false;
  bipBopMesaj.innerText = "🤖: Hafıza temizlendi! Yeni rota bekliyorum.";
};

=======
>>>>>>> a88738f1bce31aa7d6b9aaf9c359bbb00a29d2e1
function komutEkle(komut) {
  komutKuyrugu.push(komut);
  const yeniKomutSatiri = document.createElement("div");
  yeniKomutSatiri.className =
    "badge bg-info text-dark m-1 p-2 d-block text-start border border-light";
  yeniKomutSatiri.innerHTML = `⚙️ ${komut.toUpperCase()}`;
  kodAkisiPanel.appendChild(yeniKomutSatiri);
  bipBopMesaj.innerText = `Harika! "${komut}" komutunu hafızaya aldım Kaptan!`;
}

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
      bipBopMesaj.innerText = "🤖: Rota bitti ama henüz parçayı bulamadık.";
      return;
    }

    const aktifKomut = komutKuyrugu.shift();
    mantiksalHesaplama(aktifKomut);

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

function mantiksalHesaplama(komut) {
  if (komut === "ileri") {
    if (karakterYon === 0) karakterPozisyon.z++;
    if (karakterYon === 90) karakterPozisyon.x++;
    if (karakterYon === 180) karakterPozisyon.z--;
    if (karakterYon === 270) karakterPozisyon.x--;
  } else if (komut === "sağa dön") {
<<<<<<< HEAD
    karakterYon = (karakterYon + 270) % 360;
  } else if (komut === "sola dön") {
    karakterYon = (karakterYon + 90) % 360;
=======
    karakterYon = (karakterYon + 90) % 360;
  } else if (komut === "sola dön") {
    karakterYon = (karakterYon + 270) % 360;
>>>>>>> a88738f1bce31aa7d6b9aaf9c359bbb00a29d2e1
  }

  if (window.karakteri3DHareketEttir) {
    window.karakteri3DHareketEttir(karakterPozisyon, karakterYon);
  }
}

function hedefKontrol() {
<<<<<<< HEAD
  const hedef = window.mevcutHedef || { x: 2, z: 2 };

  if (karakterPozisyon.x === hedef.x && karakterPozisyon.z === hedef.z) {
    bipBopMesaj.innerText = "🤖: MÜKEMMEL! Parçayı bulduk!";
    if (window.hedefeUlasildiTetikle) {
      window.hedefeUlasildiTetikle();
    } else if (window.soruEkraniAc) {
=======
  const hedef = { x: 2, z: 2 };

  if (karakterPozisyon.x === hedef.x && karakterPozisyon.z === hedef.z) {
    bipBopMesaj.innerText = "🤖: MÜKEMMEL! Parçayı bulduk!";
    if (window.soruEkraniAc) {
>>>>>>> a88738f1bce31aa7d6b9aaf9c359bbb00a29d2e1
      window.soruEkraniAc();
    }
    return true;
  }
  return false;
}
