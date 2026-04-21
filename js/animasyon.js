// SES DOSYALARI
const sesler = {
    click: new Audio('assets/sounds/click.mp3'),
    error: new Audio('assets/sounds/error.mp3'),
    success: new Audio('assets/sounds/success.mp3'),
    teleport: new Audio('assets/sounds/teleport.mp3')
};

// SES FONKSİYONLARI
function tiklamaSesi() { 
    sesler.click.currentTime = 0;
    sesler.click.play().catch(() => {}); 
}

function hataSesi() { 
    sesler.error.currentTime = 0;
    sesler.error.play().catch(() => {}); 
}

function basariSesi() { 
    sesler.success.currentTime = 0;
    sesler.success.play().catch(() => {}); 
}

// Işınlanma efekti(Parlama + ses)
function isinlanmaEfekti() {
    sesler.teleport.currentTime = 0;
    sesler.teleport.play().catch(() => {});

    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: white; z-index: 10000; transition: opacity 0.6s;
    `;
    document.body.appendChild(flash);

    setTimeout(() => {
        flash.style.opacity = '0';
        setTimeout(() => flash.remove(), 600);
    }, 100);
}

// KONFETİ EFEKTİ
function konfetiPatlat() {
    basariSesi();
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

// ROBOT YAZI EFEKTİ
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

// GLOBAL BAĞLAMA
window.tiklamaSesi = tiklamaSesi;
window.hataSesi = hataSesi;
window.basariSesi = basariSesi;
window.isinlanmaEfekti = isinlanmaEfekti;
window.konfetiPatlat = konfetiPatlat;
window.bipBopYaz = bipBopYaz;

// 🔗 EKİPLE UYUMLU İSİMLER
window.hataSesiCal = hataSesi;

window.basariEfektiOynat = function() {
    basariSesi();
    konfetiPatlat();
};