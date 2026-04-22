/*
 * Bu dosya, çocuğun karşısına çıkacak eğitim sorularını ve arayüzü yönetir.
 * Çoktan seçmeli ve basitleştirilmiş sorulara göre güncellenmiştir.
 */

// === 1. EĞİTİM/KODLAMA SORULARI VERİTABANI ===
const bulmacaVeritabani = [
  {
    seviye: 1,
    tema: "Dinozorlar Çağı",
    sorular: [
      {
        soru: "Robotumuzun yapacağı görevleri arka arkaya, kuralına göre dizmeye ne ad veririz?",
        secenekler: ["Sıralama", "Zıplama", "Saklanma"],
        dogruCevap: "Sıralama",
        ipucu: "Olayların belli bir düzene göre art arda gelmesidir.",
      },
      {
        soru: "Robot Bip-Bop'un bir problemi çözmek için adım adım izlediği yola ne denir?",
        secenekler: ["Batarya", "Algoritma", "Ekran"],
        dogruCevap: "Algoritma",
        ipucu: "'A' harfi ile başlar, bir işi başarmak için hazırlanan plandır.",
      },
      {
        soru: "Robotumuza önce 'İleri Git', sonra 'Sağa Dön' dedik. Robot ilk olarak hangisini yapar?",
        secenekler: ["Sağa Dön", "Bekle", "İleri Git"],
        dogruCevap: "İleri Git",
        ipucu: "Kodlar her zaman en üstten okunmaya başlar.",
      },
    ],
  },
  {
    seviye: 2,
    tema: "Antik Mısır",
    sorular: [
      {
        soru: "Aynı komutu alt alta defalarca yazmak yerine, işimizi kolaylaştıran hangi yapıyı kullanırız?",
        secenekler: ["Döngü", "Bitiş", "Hata"],
        dogruCevap: "Döngü",
        ipucu: "Tekrar eden işleri tek bir komutla yapmamızı sağlar.",
      },
      {
        soru: "'5 kez İleri Git' demek, alt alta 5 tane 'İleri' yazmaya göre kodumuzu nasıl etkiler?",
        secenekler: ["Uzatır", "Kısaltır", "Bozar"],
        dogruCevap: "Kısaltır",
        ipucu: "Daha az yazı yazarak aynı işi yapmış oluruz.",
      },
      {
        soru: "Bir işlemin hiç durmadan, sürekli başa sarıp tekrarlanmasına ne ad verilir?",
        secenekler: ["Uyku Modu", "Hızlı Çalışma", "Sonsuz Döngü"],
        dogruCevap: "Sonsuz Döngü",
        ipucu: "Hiç bitmeyen, sonsuza kadar süren bir tekrardır.",
      },
    ],
  },
  {
    seviye: 3,
    tema: "Uzay İstasyonu",
    sorular: [
      {
        soru: "'Karşına meteor çıkarsa sağa dön' derken, kararlarımız için hangi yapıyı kullanırız?",
        secenekler: ["Eğer", "Geri", "Sil"],
        dogruCevap: "Eğer",
        ipucu: "Bir şartımız olduğunda kullandığımız kelimedir.",
      },
      {
        soru: "Eğer (Engel Varsa) { Sağa Dön } değilse { Düz Git }. Peki engel YOKSA robotumuz ne yapar?",
        secenekler: ["Durur", "Düz Git", "Sağa Dön"],
        dogruCevap: "Düz Git",
        ipucu: "Engel olma şartı gerçekleşmediğinde yapılacak olan eylemi seçmelisin.",
      },
      {
        soru: "Hedefe ulaştığımızda oyunun bitmesi için hangi komutu vermeliyiz?",
        secenekler: ["Hızlan", "Zıpla", "Dur"],
        dogruCevap: "Dur",
        ipucu: "Oyunun veya hareketin sona ermesini sağlar.",
      },
    ],
  },
];

// --- KRİTİK DEĞİŞİKLİK: Değişkeni window objesine bağladık ---
window.mevcutSeviyeIndeksi = 0;
let quizModalInstance = null;
let aktifRastgeleSoru = null;

// === 2. ARAYÜZ (HTML) ENJEKSİYONU ===
function modalIceriginiHazirla() {
  const quizIcerik = document.getElementById("quiz-icerik");
  if (!quizIcerik) return;

  quizIcerik.innerHTML = `
        <div class="modal-header border-info bg-info text-dark">
            <h5 class="modal-title fw-bold">🧩 <span id="tema-baslik">Makine Şifresi</span></h5>
        </div>
        <div class="modal-body text-center p-4">
            <div class="mb-3 bg-secondary rounded p-3 text-start">
                <strong class="text-info">🤖 Bip-Bop:</strong>
                <p class="mb-0 mt-1 small">Parçayı alabilmek için doğru seçeneği işaretlemelisin Kaptan!</p>
            </div>
            <h5 id="soru-metni" class="mb-4 fw-bold">Soru yükleniyor...</h5>
            
            <div id="secenekler-alani" class="d-flex flex-column gap-3 mb-3">
                </div>

            <p id="ipucu-metni" class="text-warning mt-3 small fw-bold fs-6" style="display: none;"></p>
        </div>
    `;
}

// === 3. MOTOR İLE BAĞLANTI ===
window.soruEkraniAc = function () {
  console.log("Motor parça buldu! Soru ekranı açılıyor...");

  if (window.mevcutSeviyeIndeksi >= bulmacaVeritabani.length) return;

  if (document.getElementById("secenekler-alani") === null) {
    modalIceriginiHazirla();
  }

  const aktifSeviye = bulmacaVeritabani[window.mevcutSeviyeIndeksi];
  const rastgeleSayi = Math.floor(Math.random() * aktifSeviye.sorular.length);
  aktifRastgeleSoru = aktifSeviye.sorular[rastgeleSayi];

  document.getElementById("tema-baslik").innerText = aktifSeviye.tema;
  document.getElementById("soru-metni").innerText = aktifRastgeleSoru.soru;
  document.getElementById("ipucu-metni").style.display = "none";

  // Seçenekleri Ekrana Çizdirme
  const seceneklerAlani = document.getElementById("secenekler-alani");
  seceneklerAlani.innerHTML = ""; // Önceki seçenekleri temizle

  aktifRastgeleSoru.secenekler.forEach(secenek => {
    seceneklerAlani.innerHTML += `
      <button class="btn btn-dark border-info text-white btn-lg fw-bold" onclick="window.cevabiKontrolEt('${secenek}')">
        ${secenek}
      </button>
    `;
  });

  const modalElement = document.getElementById("quizModal");
  if (!quizModalInstance) {
    quizModalInstance = new bootstrap.Modal(modalElement, {
      backdrop: "static",
      keyboard: false,
    });
  }
  quizModalInstance.show();
};

// === 4. CEVAP KONTROL MANTIĞI ===
// Kullanıcının tıkladığı seçeneği parametre olarak alıyoruz
window.cevabiKontrolEt = function (secilenCevap) {
  const dogruCevap = aktifRastgeleSoru.dogruCevap;

  if (secilenCevap === dogruCevap) {
    console.log("Cevap Doğru!");
    quizModalInstance.hide();

    // 1. Önce seviyeyi arttırıyoruz
    window.mevcutSeviyeIndeksi++;

    // 2. Motoru (0,0 noktasına) sıfırlıyoruz
    if (typeof window.yeniSeviyeyeHazirlan === "function") {
      window.yeniSeviyeyeHazirlan();
    }

    // 3. Başarı sesini çal (varsa)
    if (typeof window.basariEfektiOynat === "function") {
      window.basariEfektiOynat();
    }

    // 4. Oyun sonu kontrolü
    if (window.mevcutSeviyeIndeksi >= bulmacaVeritabani.length) {
      setTimeout(() => {
        alert("🎉 GÖREV BAŞARILI KAPTAN! Zaman makinesi tamir edildi!");
      }, 1000);
    }
  } else {
    console.log("Cevap Yanlış!");
    const ipucuMetni = document.getElementById("ipucu-metni");
    ipucuMetni.innerText = "Hatalı şifre! 🤖 İpucu: " + aktifRastgeleSoru.ipucu;
    ipucuMetni.style.display = "block";

    if (typeof window.hataSesiCal === "function") {
      window.hataSesiCal();
    }
  }
};
