// Ses dosyalarının tanımlanması
const sesler = {
    click: new Audio('assets/sounds/click.mp3'),
    error: new Audio('assets/sounds/error.mp3'),
    success: new Audio('assets/sounds/success.mp3'),
    teleport: new Audio('assets/sounds/teleport.mp3')
};

// Temel ses fonksiyonları
function tiklamaSesi() { 
    sesler.click.play().catch(e => console.warn("Etkileşim bekleniyor.")); 
}

function hataSesi() { 
    sesler.error.play().catch(e => console.warn("Hata sesi çalınamadı.")); 
}

function basariSesi() { 
    sesler.success.play().catch(e => console.warn("Başarı sesi çalınamadı.")); 
}

// Işınlanma efekti (Parlama + Ses)
function isinlanmaEfekti() {
    sesler.teleport.play().catch(e => console.warn("Ses hatası."));

    const flas = document.createElement('div');
    flas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: white; z-index: 10000; transition: opacity 0.6s;
    `;
    document.body.appendChild(flas);

    setTimeout(() => {
        flas.style.opacity = '0';
        setTimeout(() => flas.remove(), 600);
    }, 100);
}

// Başarı anında patlayan renkli konfetiler
function konfetiPatlat() {
    basariSesi(); // Konfetiyle birlikte başarı sesini de çal
    for (let i = 0; i < 40; i++) {
        const k = document.createElement('div');
        k.style.cssText = `
            position: fixed; width: 8px; height: 8px; z-index: 10001;
            background: ${['#ff0', '#f0f', '#0ff', '#0f0'][Math.floor(Math.random()*4)]};
            top: -10px; left: ${Math.random()*100}vw;
        `;
        document.body.appendChild(k);
        k.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: `translate(${Math.random()*200-100}px, 100vh)`, opacity: 0 }
        ], { duration: 2000 + Math.random()*2000 });
        setTimeout(() => k.remove(), 4000);
    }
}

// Robot konuşma efekti
function bipBopYaz(metin, elementId = "bipbop-mesaj") {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = "";
    let i = 0;
    const yazici = setInterval(() => {
        if (i < metin.length) {
            el.innerHTML += metin[i];
            i++;
        } else {
            clearInterval(yazici);
        }
    }, 50);
}

// Global erişim için window objesine bağlama
window.tiklamaSesi = tiklamaSesi;
window.hataSesi = hataSesi;
window.basariSesi = basariSesi;
window.isinlanmaEfekti = isinlanmaEfekti;
window.konfetiPatlat = konfetiPatlat;
window.bipBopYaz = bipBopYaz;