let komutKuyrugu    = [];
let karakterPozisyon = { x: 0, z: 0 };
let karakterYon      = 0;          // degrees: 0=+Z, 90=+X, 180=-Z, 270=-X
let calistiriyorMu   = false;

const btnIleri    = document.getElementById("btn-ileri");
const btnSag      = document.getElementById("btn-sag");
const btnSol      = document.getElementById("btn-sol");
const btnCalistir = document.getElementById("btn-calistir");
const btnSil      = document.getElementById("btn-sil");
const btnTemizle  = document.getElementById("btn-temizle");
const kodAkisi    = document.getElementById("kod-akisi");
const bipBopMesaj = document.getElementById("bipbop-mesaj");

// ── Helper: update step-counter label ────────────────────────────────────────
function updateBlockCount() {
  const el = document.getElementById("adim-sayaci");
  if (el) el.innerText = `${komutKuyrugu.length} blocks`;
}

// ── Add command block ─────────────────────────────────────────────────────────
function komutEkle(komut) {
  komutKuyrugu.push(komut);

  const methodMap = { "ileri": "ileri", "sağa dön": "sag", "sola dön": "sol" };
  const method = methodMap[komut] || komut;

  const div = document.createElement("div");
  div.style.cssText = "border-left:3px solid #9eff00;background:rgba(158,255,0,0.05);border-radius:4px;padding:4px 8px;font-size:0.8rem;";
  div.innerHTML = `<span style="color:#7f8c8d;font-weight:bold">&gt;&gt;&gt; </span><span style="color:#c3a6ff">robot</span><span style="color:rgba(255,255,255,0.4)">.</span><span style="color:#9eff00;font-weight:bold">${method}</span><span style="color:rgba(255,255,255,0.4)">()</span>`;
  kodAkisi.appendChild(div);

  if (bipBopMesaj) bipBopMesaj.innerText = `🤖 robot.${method}() eklendi!`;
  updateBlockCount();
}

// ── Reset algorithm state ─────────────────────────────────────────────────────
window.algoritmayiTemizle = function () {
  komutKuyrugu     = [];
  karakterPozisyon = { x: 0, z: 0 };
  karakterYon      = 0;
  if (kodAkisi) kodAkisi.innerHTML = "";
  updateBlockCount();
  if (window.renderer3D?.update) {
    window.renderer3D.update(karakterPozisyon, karakterYon);
  }
};

// ── Grid boundary clamp ───────────────────────────────────────────────────────
const MAX_CELL = 4;   // 5×5 grid → cells 0..4

function mantiksalHesaplama(komut) {
  if (komut === "ileri") {
    if (karakterYon === 0)   karakterPozisyon.z = Math.min(MAX_CELL, karakterPozisyon.z + 1);
    if (karakterYon === 90)  karakterPozisyon.x = Math.min(MAX_CELL, karakterPozisyon.x + 1);
    if (karakterYon === 180) karakterPozisyon.z = Math.max(0,        karakterPozisyon.z - 1);
    if (karakterYon === 270) karakterPozisyon.x = Math.max(0,        karakterPozisyon.x - 1);
  } else if (komut === "sağa dön") {
    karakterYon = (karakterYon + 270) % 360; // 270 is -90 (Turn its own Right)
  } else if (komut === "sola dön") {
    karakterYon = (karakterYon + 90) % 360;  // 90 is +90 (Turn its own Left)
  }

  if (window.karakteriGuncelle) window.karakteriGuncelle(karakterPozisyon, karakterYon);
}

// ── Check if target reached ───────────────────────────────────────────────────
function hedefKontrol() {
  const hedef = window.mevcutHedef || { x: MAX_CELL, z: MAX_CELL };
  if (karakterPozisyon.x === hedef.x && karakterPozisyon.z === hedef.z) {
    if (bipBopMesaj) bipBopMesaj.innerText = "🤖: MÜKEMMEL! Hedefe ulaştık!";
    if (window.hedefeUlasildiTetikle) window.hedefeUlasildiTetikle();
    return true;
  }
  return false;
}

// ── Run the command queue ─────────────────────────────────────────────────────
function algoritmayiCalistir() {
  if (calistiriyorMu) return;
  if (komutKuyrugu.length === 0) {
    if (bipBopMesaj) bipBopMesaj.innerText = "🤖: Kaptan, önce bir rota oluşturmalısın!";
    return;
  }

  calistiriyorMu = true;
  btnCalistir.disabled = true;
  if (bipBopMesaj) bipBopMesaj.innerText = "🤖: Sistem devrede! Rota takip ediliyor...";

  const queue = [...komutKuyrugu];
  komutKuyrugu = [];
  if (kodAkisi) kodAkisi.innerHTML = "";
  updateBlockCount();

    let i = 0;
    const tick = setInterval(() => {
      if (i >= queue.length) {
        clearInterval(tick);
        btnCalistir.disabled = false;
        calistiriyorMu = false;
        if (!hedefKontrol()) {
          if (bipBopMesaj) bipBopMesaj.innerText = "🤖: Rota bitti ama hedefe ulaşamadık. Tekrar dene!";
        }
        return;
      }

      mantiksalHesaplama(queue[i]);
      i++;

      if (hedefKontrol()) {
        clearInterval(tick);
        btnCalistir.disabled = false;
        calistiriyorMu = false;
      }
    }, 400); // Hız artırıldı: Saniyede > 2 komut
  }

// ── Button listeners ──────────────────────────────────────────────────────────
if (btnIleri)    btnIleri.addEventListener("click",    () => komutEkle("ileri"));
if (btnSag)      btnSag.addEventListener("click",      () => komutEkle("sağa dön"));
if (btnSol)      btnSol.addEventListener("click",      () => komutEkle("sola dön"));
if (btnCalistir) btnCalistir.addEventListener("click", algoritmayiCalistir);

if (btnSil) btnSil.addEventListener("click", () => {
  if (komutKuyrugu.length) {
    komutKuyrugu.pop();
    if (kodAkisi?.lastChild) kodAkisi.removeChild(kodAkisi.lastChild);
    updateBlockCount();
  }
});

if (btnTemizle) btnTemizle.addEventListener("click", () => window.algoritmayiTemizle());
