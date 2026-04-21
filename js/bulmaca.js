/*
 * Bu dosya, çocuğun karşısına çıkacak eğitim sorularını ve arayüzü yönetir.
 */

// === 1. EĞİTİM/KODLAMA SORULARI VERİTABANI ===
const bulmacaVeritabani = [
  {
    seviye: 1,
    tema: "Dinozorlar Çağı",
    sorular: [
      {
        soru: "Kaptan! Dinozor yumurtalarını kırmamak için komutları arka arkaya doğru bir sıraya koyduk. Kodlamada buna ne ad verilir?",
        cevap: "sıralama",
        ipucu:
          "S... ile başlayan, şeyleri art arda dizmek anlamına gelen bir kelime.",
      },
      {
        soru: "Robot Bip-Bop komutları teker teker, adım adım okur. Bu adım adım işleyişe ne diyoruz?",
        cevap: "algoritma",
        ipucu: "A... ile başlar. Bir problemi çözmek için izlenen yol.",
      },
      {
        soru: "Eğer 'İleri' komutundan sonra 'Sağa Dön' komutunu verirsek karakterimiz önce hangi komutu yapar?",
        cevap: "ileri",
        ipucu: "Kodlar her zaman yukarıdan aşağıya ve sırasıyla okunur.",
      },
    ],
  },
  {
    seviye: 2,
    tema: "Antik Mısır",
    sorular: [
      {
        soru: "Uzun piramit koridorlarını geçerken aynı komutu defalarca yazmak yerine hangi yapıyı kullanarak kodumuzu kısalttık?",
        cevap: "döngü",
        ipucu: "D... ile başlayan, tekrar eden işler için kullandığımız yapı.",
      },
      {
        soru: "Bip-Bop'un 5 kere 'İleri' gitmesi gerekiyor. 5 tane İleri yazmak yerine '5 kez tekrarla' demek kodumuzu nasıl etkiler?",
        cevap: "kısaltır",
        ipucu: "K... ile başlar. Daha az kod yazmamızı sağlar.",
      },
      {
        soru: "Bir işlemin sürekli, hiç durmadan baştan başlamasına ne ad verilir?",
        cevap: "sonsuz döngü",
        ipucu: "S... D... şeklindedir. Hiç bitmeyen bir tekrar anlamına gelir.",
      },
    ],
  },
  {
    seviye: 3,
    tema: "Uzay İstasyonu",
    sorular: [
      {
        soru: "Karşımıza meteor çıkarsa sağa kaç, çıkmazsa düz git demek için hangi mantıksal karar yapısını kullanırız?",
        cevap: "eğer",
        ipucu: "İngilizcesi 'IF' olan şart yapısı...",
      },
      {
        soru: "Eğer (Meteor Varsa) { Sağa Dön } değilse { Düz Git } kodunda meteor yoksa karakter ne yapar?",
        cevap: "düz git",
        ipucu: "Şart sağlanmadığı ('değilse') için yapılan işlem nedir?",
      },
      {
        soru: "Oyun motorunda parçaya 'Eğer hedefe ulaşıldıysa' ne yapılır?",
        cevap: "dur",
        ipucu: "D... ile başlar. Parçayı alınca kodun çalışması biter.",
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
                <p class="mb-0 mt-1 small">Parçayı alabilmek için bu soruyu cevaplamalısın Kaptan!</p>
            </div>
            <h5 id="soru-metni" class="mb-4">Soru yükleniyor...</h5>
            <input type="text" id="cevap-input" class="form-control bg-dark text-white border-info text-center form-control-lg" placeholder="Cevabını buraya yaz...">
            <p id="ipucu-metni" class="text-warning mt-3 small fw-bold fs-6" style="display: none;"></p>
        </div>
        <div class="modal-footer border-info justify-content-center">
            <button type="button" class="btn btn-info px-5 fw-bold" onclick="window.cevabiKontrolEt()">Şifreyi Onayla</button>
        </div>
    `;

  document
    .getElementById("cevap-input")
    .addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        window.cevabiKontrolEt();
      }
    });
}

// === 3. MOTOR İLE BAĞLANTI ===
window.soruEkraniAc = function () {
  console.log("Motor parça buldu! Soru ekranı açılıyor...");

  if (window.mevcutSeviyeIndeksi >= bulmacaVeritabani.length) return;

  if (document.getElementById("cevap-input") === null) {
    modalIceriginiHazirla();
  }

  const aktifSeviye = bulmacaVeritabani[window.mevcutSeviyeIndeksi];
  const rastgeleSayi = Math.floor(Math.random() * aktifSeviye.sorular.length);
  aktifRastgeleSoru = aktifSeviye.sorular[rastgeleSayi];

  document.getElementById("tema-baslik").innerText = aktifSeviye.tema;
  document.getElementById("soru-metni").innerText = aktifRastgeleSoru.soru;
  document.getElementById("cevap-input").value = "";
  document.getElementById("ipucu-metni").style.display = "none";

  const modalElement = document.getElementById("quizModal");
  if (!quizModalInstance) {
    quizModalInstance = new bootstrap.Modal(modalElement, {
      backdrop: "static",
      keyboard: false,
    });
  }
  quizModalInstance.show();

  setTimeout(() => document.getElementById("cevap-input").focus(), 500);
};

// === 4. CEVAP KONTROL MANTIĞI ===
window.cevabiKontrolEt = function () {
  const inputElement = document.getElementById("cevap-input");
  const kullaniciCevabi = inputElement.value.trim().toLowerCase();
  const dogruCevap = aktifRastgeleSoru.cevap.toLowerCase();

  if (kullaniciCevabi === "") return;

  if (kullaniciCevabi === dogruCevap) {
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
