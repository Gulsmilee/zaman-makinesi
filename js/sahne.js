const CHARACTER_ASSETS = {
    ROBOT: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" style="width: 100%; height: 100%; filter: drop-shadow(0px 0px 30px rgba(0,255,255,1));">
            <line x1="50" y1="20" x2="50" y2="5" stroke="#95a5a6" stroke-width="4"/>
            <circle cx="50" cy="5" r="5" fill="#e74c3c"><animate attributeName="fill" values="#e74c3c;#c0392b;#e74c3c" dur="1s" repeatCount="indefinite"/></circle>
            <rect x="20" y="20" width="60" height="50" rx="10" fill="#2c3e50"/>
            <rect x="25" y="25" width="50" height="40" rx="5" fill="#111"/>
            <path d="M30 45 Q50 65 70 45" stroke="#00ffff" stroke-width="4" fill="transparent"/>
            <path d="M40 70 L60 70 L70 110 L30 110 Z" fill="#7f8c8d" opacity="0.8"/>
            <ellipse cx="50" cy="110" rx="20" ry="8" fill="#00ffff" opacity="0.6"/>
        </svg>`,
    DRAGON: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" style="width: 100%; height: 100%;">
            <defs>
                <radialGradient id="dinoEye" cx="30%" cy="30%" r="50%">
                    <stop offset="0%" stop-color="#00ffff"/>
                    <stop offset="100%" stop-color="#0066ff"/>
                </radialGradient>
            </defs>
            <path d="M40 90 Q10 100 0 80 Q20 85 40 85 Z" fill="#661a29"/>
            <path d="M55 90 L50 110 L60 110 L65 95 Z" fill="#4a101b"/>
            <rect x="50" y="105" width="10" height="5" fill="#f0e6d2"/>
            <ellipse cx="60" cy="70" rx="25" ry="20" fill="#802033" transform="rotate(-15 60 70)"/>
            <path d="M70 90 L65 115 L75 115 L78 95 Z" fill="#802033"/>
            <rect x="65" y="105" width="10" height="5" fill="#f0e6d2"/>
            <path d="M65 115 L62 120 M70 115 L70 120 M75 115 L78 120" stroke="#f0e6d2" stroke-width="2"/>
            <rect x="45" y="45" width="30" height="20" rx="5" fill="#5c4a3d"/>
            <path d="M48 45 Q55 30 65 45 Z" fill="#8bc34a"/>
            <path d="M55 45 Q65 25 75 45 Z" fill="#689f38"/>
            <path d="M75 60 Q85 40 80 20 L110 30 Q120 40 100 50 L85 65 Z" fill="#802033"/>
            <path d="M80 45 Q105 45 105 50 Q105 55 80 55 Z" fill="#ffbda1" />
            <path d="M95 45 L98 48 L100 45 L103 48 L105 45 Z" fill="#fff"/>
            <path d="M80 70 L90 85 L95 82" fill="none" stroke="#802033" stroke-width="4" stroke-linecap="round"/>
            <circle cx="85" cy="30" r="7" fill="url(#dinoEye)">
                <animate attributeName="r" values="7;8;7" dur="2s" repeatCount="indefinite"/>
            </circle>
            <ellipse cx="85" cy="30" rx="2" ry="5" fill="#000" transform="rotate(20 85 30)"/>
            <circle cx="70" cy="35" r="5" fill="none" stroke="#ffd700" stroke-width="2"/>
            <polygon points="70,40 73,48 67,48" fill="#ffd700"/>
            <path d="M75 15 Q65 10 70 20 Z" fill="#4a101b"/>
            <path d="M70 20 Q60 15 65 25 Z" fill="#4a101b"/>
            <path d="M70 50 L90 60 L85 65 L65 55 Z" fill="#f4a261"/>
            <path d="M70 55 L85 62" stroke="#e76f51" stroke-width="2"/>
        </svg>`,
    ROBOT_HEAD: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="width: 100%; height: 100%;">
            <rect x="20" y="20" width="60" height="50" rx="10" fill="#2c3e50"/>
            <rect x="25" y="25" width="50" height="40" rx="5" fill="#111"/>
            <path d="M30 45 Q50 65 70 45" stroke="#00ffff" stroke-width="4" fill="transparent"/>
            <line x1="50" y1="20" x2="50" y2="5" stroke="#95a5a6" stroke-width="4"/>
            <circle cx="50" cy="5" r="5" fill="#e74c3c"/>
        </svg>`,
    DRAGON_HEAD: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" style="width: 100%; height: 100%; transform: scale(1.2) translateY(5px) translateX(-5px);">
            <radialGradient id="dinoEyeUI" cx="30%" cy="30%" r="50%">
                <stop offset="0%" stop-color="#00ffff"/>
                <stop offset="100%" stop-color="#0066ff"/>
            </radialGradient>
            <path d="M40 100 L40 60 Q40 20 70 30 Q105 40 85 60 L60 70 L60 100 Z" fill="#802033"/>
            <path d="M40 60 Q80 50 85 60 Q70 75 40 80 Z" fill="#ffbda1" /> 
            <path d="M60 55 L65 60 L70 55 L75 60" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>
            <circle cx="55" cy="35" r="12" fill="url(#dinoEyeUI)">
                <animate attributeName="r" values="12;14;12" dur="2s" repeatCount="indefinite"/>
            </circle>
            <ellipse cx="55" cy="35" rx="3" ry="8" fill="#000" transform="rotate(20 55 35)"/>
            <circle cx="35" cy="45" r="6" fill="none" stroke="#ffd700" stroke-width="3"/>
            <polygon points="35,51 39,60 31,60" fill="#ffd700"/>
            <path d="M30 20 Q15 15 25 35 Z" fill="#4a101b"/>
            <path d="M25 35 Q10 30 20 50 Z" fill="#4a101b"/>
        </svg>`
 };

 window.screenShake = function(type = 'light') {
    const container = document.getElementById("game-container");
    if (!container) return;
    
    const className = type === 'heavy' ? 'shake-heavy' : 'shake-light';
    container.classList.remove('shake-light', 'shake-heavy');
    void container.offsetWidth; 
    container.classList.add(className);
    
    setTimeout(() => container.classList.remove(className), type === 'heavy' ? 500 : 200);
 };

  window.createParticles = function(x, y, baseColor = '#fff', count = 12, type = 'dust') {
     const container = document.getElementById("game-container");
     if (!container) return;

     const colors = type === 'sparkle' 
        ? ['#ffd700', '#ffea00', '#fff', '#ffab40', baseColor]
        : ['#ffffff44', '#aaa', baseColor];

     for (let i = 0; i < count; i++) {
         const p = document.createElement("div");
         p.className = "particle";
         
         const size = type === 'sparkle' ? Math.random() * 15 + 5 : Math.random() * 8 + 4;
         const color = colors[Math.floor(Math.random() * colors.length)];
         
         p.style.width = `${size}px`;
         p.style.height = `${size}px`;
         p.style.background = color;
         p.style.left = `${x}px`;
         p.style.top = `${y}px`;
         p.style.boxShadow = `0 0 ${size * 2}px ${color}`;
         
         const animation = type === 'dust' ? 'dustPoof' : 'sparkleOut';
         const duration = type === 'sparkle' ? 0.6 + Math.random() * 0.4 : 0.5 + Math.random() * 0.5;
         
         p.style.animation = `${animation} ${duration}s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
         
         container.appendChild(p);
         setTimeout(() => p.remove(), duration * 1000);
     }
  };

  const temalar = [
    {
        sinif: "tema-dinozor-oda",
        baslik: "Dinozorlar Çağı - Balta Girmemiş Orman",
        hedefHTML: ``,
        envPath: "assets/diorama_trex_rigged_free/scene.gltf",
        targetPath: "assets/a_dinosaur_cub_sitting_in_a_dinosaur_egg/scene.gltf",
        envOffset:  { x: 0, y: 0, z: 0 },
        envScale:   18,
        gridOffset: { x: 2.5, z: 1.5 }  // flat green zone (front-right) without falling off
    },
    {
        sinif: "tema-misir-oda",
        baslik: "Antik Mısır - Piramit Dehlizi",
        hedefHTML: `⚰️`,
        envPath: "assets/environment_pack_-_egypt_map/scene.gltf",
        targetPath: null,
        envOffset:  { x: 0, y: 0, z: 0 },
        envScale:   20,
        gridOffset: null                   // auto-detect
    },
    {
        sinif: "tema-uzay-oda",
        baslik: "Mantar Dünyası - Karanlık Orman",
        hedefHTML: `👽`,
        envPath: "assets/mushrooms/scene.gltf",
        targetPath: null,
        envOffset:  { x: 0, y: 0, z: 0 },
        envScale:   120,
        gridOffset: { x: 0, z: 0 },   // model floors at origin, land is there
        rayY: 80,
        hideDome: true,
        ambientColor: 0x5588ff,
        ambientIntensity: 0.5,
        pointColor: 0x00ffff,
        pointIntensity: 2.2
    }
];

window.mevcutTemaIndeksi = 0;

const worldBg = document.getElementById("world-background");
const seviyeBaslik = document.getElementById("seviye-baslik");
const karakterKapsayici = document.getElementById("karakter-kapsayici");
const hedefNesnesi = document.getElementById("hedef-nesnesi");
const portalEnerji = document.getElementById("portal-enerji");

function temayiGuncelle() {
    const aktifTema = temalar[window.mevcutTemaIndeksi];
    
    window.mevcutHedef = { x: 4, z: 4 };

    worldBg.className = aktifTema.sinif;
    
    if (seviyeBaslik) seviyeBaslik.innerText = aktifTema.baslik;

    if (hedefNesnesi) {
        if (aktifTema.hedefHTML) {
            hedefNesnesi.innerHTML = `<div class="hedef-animasyon">${aktifTema.hedefHTML}</div>`;
            hedefNesnesi.style.display = 'block';
        } else {
            hedefNesnesi.innerHTML = '';
            hedefNesnesi.style.display = 'none';
        }
        hedefNesnesi.className = "hedef-merkez";
    }

    const bipbopKapsayici = document.getElementById("bipbop-karekter-yani");
    const diagKapsayici   = document.getElementById("bipbop-diagnostics-icon");
    
    if (aktifTema.sinif.includes("misir")) {
        if (bipbopKapsayici) bipbopKapsayici.innerHTML = CHARACTER_ASSETS.DRAGON;
        if (diagKapsayici)   diagKapsayici.innerHTML   = CHARACTER_ASSETS.DRAGON_HEAD;
    } else {
        if (bipbopKapsayici) bipbopKapsayici.innerHTML = CHARACTER_ASSETS.ROBOT;
        if (diagKapsayici)   diagKapsayici.innerHTML   = CHARACTER_ASSETS.ROBOT_HEAD;
    }

    if (window.renderer3D) {
        if (!window.renderer3D._inited) {
            window.renderer3D.init("renderer-3d-viewport");
            window.renderer3D._inited = true;
        }

        // If this era was already preloaded in the background, skip 3D network load
        if (window._preloadedEraIndex === window.mevcutTemaIndeksi) {
            window._preloadedEraIndex = undefined; // consume
        } else if (aktifTema.envPath) {
            if (window.renderer3D.resetGridCentre) {
                window.renderer3D.resetGridCentre();
            }
            if (window.renderer3D.setHideOuterDome) {
                window.renderer3D.setHideOuterDome(!!aktifTema.hideDome);
            }
            if (window.renderer3D.setThemeLighting) {
                window.renderer3D.setThemeLighting(
                    aktifTema.ambientColor || 0xffffff,
                    aktifTema.ambientIntensity || 0.65,
                    aktifTema.pointColor || 0x00ffff,
                    aktifTema.pointIntensity || 0
                );
            }
            window.renderer3D.setRayOriginY(aktifTema.rayY || 60);
            window.renderer3D.loadEnvironment(
                aktifTema.envPath,
                aktifTema.envOffset || { x: 0, y: 0, z: 0 },
                aktifTema.envScale  || 18
            ).then(() => {
                if (aktifTema.gridOffset && window.renderer3D.setGridCentre) {
                    window.renderer3D.setGridCentre(
                        aktifTema.gridOffset.x,
                        aktifTema.gridOffset.z
                    );
                }
                window.renderer3D.loadCharacter("assets/character/scene.gltf");
                window.renderer3D.loadBipBop("assets/space_maintenance_robot (1)/scene.gltf");
                if (aktifTema.targetPath) {
                    window.renderer3D.loadTarget(aktifTema.targetPath);
                }
            });
        }
    }
    
    if (window.algoritmayiTemizle) {
        window.algoritmayiTemizle();
    }

    if (window.ambientManager) {
        window.ambientManager.init(aktifTema.sinif);
    }
}

window.karakteriGuncelle = function(pos, rot) {
    if (window.renderer3D && window.renderer3D.update) {
        window.renderer3D.update(pos, rot);
    }
};

window.sahneGuncelle = function() {}; // 3D renderer handles all visuals now

window.karakteri3DHareketEttir = function(pozisyon, aci) {
    window.karakteriGuncelle(pozisyon, aci);
};


window.basariEfektiOynat = function() {
    const kutlamaUI = document.getElementById("kutlama-yazisi");
    if (kutlamaUI) {
        kutlamaUI.innerHTML = `
            <div class="hologram-panel p-5 text-center shadow-lg" style="background: rgba(13, 13, 26, 0.95); border: 4px solid var(--secondary); border-radius: 30px;">
                <h1 class="tebrikler-baslik mb-3">TEBRİKLER!</h1>
                <p class="text-white fs-4 fw-bold">Zaman Parçasını Geri Kazandın!</p>
                <div class="spinner-border text-secondary mt-3" role="status"></div>
                <div class="text-secondary small mt-2 fw-black">BİR SONRAKİ ÇAĞA IŞINLANILIYOR...</div>
            </div>
        `;
        kutlamaUI.classList.add("goster");
        
        if (hedefNesnesi) hedefNesnesi.classList.add("hedef-alindi");
        if (portalEnerji) {
            setTimeout(() => portalEnerji.classList.add("portal-aciliyor"), 1000);
        }

        window.screenShake('heavy');
        if (hedefNesnesi) {
            const rect = hedefNesnesi.getBoundingClientRect();
            window.createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#ffd700', 40, 'sparkle');
        }
        
        setTimeout(() => {
            kutlamaUI.classList.remove("goster");
            if (portalEnerji) portalEnerji.classList.remove("portal-aciliyor");
            window.seviyeAtla();
        }, 4000);
    }
};

window.seviyeAtla = function() {
    const flash = document.getElementById("gecis-flas");
    if (flash) {
        flash.classList.add("gecis-aktif");
    }

    setTimeout(() => {
        window.mevcutTemaIndeksi++;
        if (window.mevcutTemaIndeksi >= temalar.length) {
            window.mevcutTemaIndeksi = 0; 
            if(window.oyunuTamamla) {
                window.oyunuTamamla();
                return;
            }
        }
        
        if (window.renderer3D) {
            window.renderer3D.clearEra();
        }

        temayiGuncelle();
        
        if (window.bipBopMesajYaz) {
            window.bipBopMesajYaz("Işınlanma tamamlandı! Yeni bir çağdayız.", "var(--tertiary)");
        }

        setTimeout(() => {
            if (flash) flash.classList.remove("gecis-aktif");
        }, 500);

    }, 1000);
};

document.addEventListener('DOMContentLoaded', () => {
    const btnBasla = document.getElementById("btn-oyuna-basla");
    const baslangicEkrani = document.getElementById("baslangic-ekrani");
    const uiLayer = document.getElementById("ui-layer");
    
    if(btnBasla) {
        btnBasla.addEventListener("click", () => {

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; top: 0; left: 0;
                width: 100vw; height: 100vh;
                background: black; z-index: 99999;
            `;

            const video = document.createElement('video');
            video.src = 'assets/videos/intro.mp4';
            video.style.cssText = `width: 100%; height: 100%; object-fit: cover;`;
            video.autoplay = true;
            video.playsInline = true;

            const gecBtn = document.createElement('button');
            gecBtn.innerText = 'Geç »';
            gecBtn.style.cssText = `
                position: absolute; bottom: 30px; right: 30px;
                background: rgba(255,255,255,0.2); color: white;
                border: 1px solid white; padding: 10px 20px;
                font-size: 16px; cursor: pointer; border-radius: 8px;
                z-index: 100000;
            `;

            overlay.appendChild(video);
            overlay.appendChild(gecBtn);
            document.body.appendChild(overlay);

            // ── Preload era 0 assets while the intro video plays ────────────────
            if (!window.renderer3D._inited) {
                window.renderer3D.init("renderer-3d-viewport");
                window.renderer3D._inited = true;
            }
            const tema0 = temalar[0];
            window.mevcutHedef = { x: 4, z: 4 };
            if (window.renderer3D.resetGridCentre) window.renderer3D.resetGridCentre();
            if (window.renderer3D.setHideOuterDome) window.renderer3D.setHideOuterDome(!!tema0.hideDome);
            if (window.renderer3D.setThemeLighting) window.renderer3D.setThemeLighting(
                tema0.ambientColor || 0xffffff, tema0.ambientIntensity || 0.65,
                tema0.pointColor || 0x00ffff,   tema0.pointIntensity || 0
            );
            window.renderer3D.setRayOriginY(tema0.rayY || 60);
            window.renderer3D.loadEnvironment(
                tema0.envPath,
                tema0.envOffset || { x: 0, y: 0, z: 0 },
                tema0.envScale  || 18
            ).then(() => {
                if (tema0.gridOffset && window.renderer3D.setGridCentre) {
                    window.renderer3D.setGridCentre(tema0.gridOffset.x, tema0.gridOffset.z);
                }
                return Promise.all([
                    window.renderer3D.loadCharacter("assets/character/scene.gltf"),
                    window.renderer3D.loadBipBop("assets/space_maintenance_robot (1)/scene.gltf"),
                    tema0.targetPath ? window.renderer3D.loadTarget(tema0.targetPath) : Promise.resolve()
                ]);
            }).then(() => {
                window._preloadedEraIndex = 0; // Signal: era 0 is ready
            }).catch(() => {
                window._preloadedEraIndex = undefined; // fallback: temayiGuncelle loads normally
            });
            // ── End preload ─────────────────────────────────────────────────────

            function oyunuBaslat() {
                overlay.remove();
                window.screenShake('light');
                baslangicEkrani.classList.add("gizle");
                uiLayer.classList.remove("d-none");

                const flas = document.getElementById("gecis-flas");
                if(flas) flas.classList.add("gecis-aktif");

                setTimeout(() => {
                    temayiGuncelle();
                    if(flas) flas.classList.remove("gecis-aktif");

                    if (window.bipBopMesajYaz) {
                        const log = document.getElementById("bipbop-mesaj");
                        if (log) log.innerHTML = "";
                        window.bipBopMesajYaz("MISSION PROTOCOL: REPAIR_TIMEMACHINE", "var(--secondary)");
                        setTimeout(() => window.bipBopMesajYaz("SECTOR: DINOSAUR_ERA_01", "#fff"), 500);
                        setTimeout(() => window.bipBopMesajYaz("OBJECTIVE: RETRIEVE TEMPORAL SHARD", "var(--tertiary)"), 1000);
                        setTimeout(() => window.bipBopMesajYaz("STATUS: READY FOR COMMANDS", "var(--secondary)"), 1500);
                    }
                }, 800);
            }

            video.addEventListener('ended', oyunuBaslat);
            gecBtn.addEventListener('click', oyunuBaslat);
        });
    }
});

window.oyunuTamamla = function() {
    const bitisEkrani = document.getElementById("oyun-sonu-ekrani");
    if (!bitisEkrani) return;

    bitisEkrani.style.setProperty('display', 'flex', 'important');
    
    setTimeout(() => {
        bitisEkrani.style.setProperty('display', 'none', 'important');
        document.getElementById("baslangic-ekrani").classList.remove("gizle");
        
        if (window.bulmacayiSifirla) window.bulmacayiSifirla();
        window.mevcutTemaIndeksi = 0;
        window.mevcutSeviyeIndeksi = 0;
        
        if (window.algoritmayiTemizle) window.algoritmayiTemizle();
        temayiGuncelle();
    }, 7000);
};

window.hedefeUlasildiTetikle = function() {
    document.getElementById("bipbop-mesaj").innerText = "🤖: MÜKEMMEL! Gizemli objeye ulaştık, inceliyorum...";
    
    const ikonObjesi = document.querySelector("#hedef-nesnesi .hedef-animasyon");
    if(ikonObjesi) {
        ikonObjesi.classList.add("obje-patla");
    }
    
    setTimeout(() => {
        if (window.soruEkraniAc) {
            window.soruEkraniAc();
        }
        if(ikonObjesi) ikonObjesi.classList.remove("obje-patla");
    }, 1500);
};

window.temaIlerlet = function() {
    if (window.mevcutTemaIndeksi < temalar.length - 1) {
        window.mevcutTemaIndeksi++;
        temayiGuncelle();
    }
};

window.hataSesiCal = function() {
    const alarm = document.getElementById("alarm-filtresi");
    if(alarm) alarm.classList.add("aktif");
    
    const glassPaneller = document.querySelectorAll(".glass-panel");
    glassPaneller.forEach(panel => {
        panel.style.transform = "translateX(-10px)";
        setTimeout(() => panel.style.transform = "translateX(10px)", 100);
        setTimeout(() => panel.style.transform = "translateX(-10px)", 200);
        setTimeout(() => panel.style.transform = "translateX(0)", 300);
    });

    setTimeout(() => {
        if(alarm) alarm.classList.remove("aktif");
    }, 1000);

    window.screenShake('heavy'); 
    const rect = karakterKapsayici.getBoundingClientRect();
    window.createParticles(rect.left + rect.width/2, rect.top + rect.height/2, '#ff4d6d', 25, 'sparkle');
};
