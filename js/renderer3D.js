/**
 * renderer3D.js - Clean 3D scene manager
 * Grid: 5x5 cells, terrain-hugging holographic lines
 * Character sits flush on terrain surface, BipBop floats to the right
 */
window.renderer3D = (function () {

    // ── Private raycaster (reused, never re-created) ──────────────────────────
    const _rc  = new THREE.Raycaster();
    const _dn  = new THREE.Vector3(0, -1, 0);

    // ── Grid constants ────────────────────────────────────────────────────────
    const COLS      = 5;
    const ROWS      = 5;
    const CELL      = 0.9;        // small cells so grid fits on flat zone
    const INTERP    = 20;
    const SCAN_SAMPLES = 20;     // always 20x20 samples regardless of scale
    let scanR      = 8;          // world-space radius to scan
    let scanStep   = 0.8;        // step = scanR*2 / SCAN_SAMPLES

    // ── Module state ─────────────────────────────────────────────────────────
    let scene, camera, renderer, clock, controls;
    let environment = null;
    let character   = null;
    let bipBop      = null;
    let target      = null;
    let shadowDisc  = null;
    let hologrid    = null;
    let ambientLight, directionalLight, pointLight;

    let envMixers  = [];
    let charMixers = [];

    let gridCX = 0, gridCZ = 0;    // current grid centre (world space)
    let gridManual = false;         // true = use manually set centre, skip auto-detect
    let rayStartY = 60;
    let hideOuterDome = false;

    // Target tracking for smooth movement
    let targetPos = new THREE.Vector3(0, 0, 0);
    let targetRotY = 0;
    let hoverY = 0;

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Sample the highest terrain point at world (wx, wz). Returns Y or null. */
    function sampleY(wx, wz) {
        if (!environment) return null;
        _rc.set(new THREE.Vector3(wx, rayStartY, wz), _dn);
        const hits = _rc.intersectObject(environment, true);
        if (!hits.length) return null;
        // Highest surface (sort desc by Y)
        let maxY = -Infinity;
        for (const h of hits) if (h.point.y > maxY) maxY = h.point.y;
        return maxY;
    }

    /** Convert grid cell indices to world XZ (col/row can be fractional for interpolation). */
    function cellToWorld(col, row) {
        const halfW = (COLS - 1) * CELL / 2;
        const halfH = (ROWS - 1) * CELL / 2;
        return {
            x: gridCX + col * CELL - halfW,
            z: gridCZ + row * CELL - halfH
        };
    }

    /** Scan terrain to find the elevated plateau's centre of mass.
     *  Fast: always uses SCAN_SAMPLES x SCAN_SAMPLES grid (max 400 raycasts).
     *  If gridManual=true, skip scan and keep the manually set centre. */
    function detectGridCentre() {
        if (gridManual) return;

        environment.updateMatrixWorld(true);

        // Build a fixed-size sample grid over [-scanR, +scanR]
        const samples = [];
        const step = (scanR * 2) / SCAN_SAMPLES;
        for (let i = 0; i <= SCAN_SAMPLES; i++) {
            for (let j = 0; j <= SCAN_SAMPLES; j++) {
                const x = -scanR + i * step;
                const z = -scanR + j * step;
                const y = sampleY(x, z);
                if (y !== null) samples.push({ x, z, y });
            }
        }

        if (!samples.length) return;

        const maxY = Math.max(...samples.map(s => s.y));
        const thresh = maxY * 0.6;
        const high = samples.filter(s => s.y >= thresh);

        gridCX = high.length ? high.reduce((a, s) => a + s.x, 0) / high.length : 0;
        gridCZ = high.length ? high.reduce((a, s) => a + s.z, 0) / high.length : 0;
    }

    /** Build terrain-hugging holographic grid and add to scene. */
    function buildGrid() {
        if (hologrid) { scene.remove(hologrid); hologrid = null; }
        if (!environment) return;

        detectGridCentre();

        const group = new THREE.Group();
        const mat   = new THREE.LineBasicMaterial({ color: 0x9eff00, transparent: true, opacity: 0.8 });
        const steps = COLS * INTERP;

        function makeLine(pts) {
            if (pts.length < 2) return;
            group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
        }

        // Horizontal lines (row constant), broken at voids
        for (let row = 0; row <= ROWS; row++) {
            let seg = [];
            for (let s = 0; s <= steps; s++) {
                const wp = cellToWorld(s / INTERP, row);
                const y  = sampleY(wp.x, wp.z);
                if (y !== null) {
                    seg.push(new THREE.Vector3(wp.x, y + 0.12, wp.z));
                } else {
                    makeLine(seg); seg = [];
                }
            }
            makeLine(seg);
        }

        // Vertical lines (col constant), broken at voids
        for (let col = 0; col <= COLS; col++) {
            let seg = [];
            for (let s = 0; s <= steps; s++) {
                const wp = cellToWorld(col, s / INTERP);
                const y  = sampleY(wp.x, wp.z);
                if (y !== null) {
                    seg.push(new THREE.Vector3(wp.x, y + 0.12, wp.z));
                } else {
                    makeLine(seg); seg = [];
                }
            }
            makeLine(seg);
        }

        hologrid = group;
        scene.add(hologrid);
    }

    /** Place target on terrain surface at its designated cell. */
    function placeTarget() {
        if (!target) return;
        const hedef = window.mevcutHedef || { x: COLS - 1, z: ROWS - 1 };
        const wp    = cellToWorld(hedef.x, hedef.z);
        const y     = sampleY(wp.x, wp.z) ?? 0;
        target.position.set(wp.x, y, wp.z);
    }

    /** Load a GLTF model, return a Promise<THREE.Group>. */
    function loadGLTF(path, onMixer) {
        return new Promise((resolve, reject) => {
            new THREE.GLTFLoader().load(path, gltf => {
                if (gltf.animations?.length && onMixer) {
                    const mx = new THREE.AnimationMixer(gltf.scene);
                    gltf.animations.forEach(c => mx.clipAction(c).play());
                    onMixer(mx);
                }
                resolve(gltf.scene);
            }, undefined, reject);
        });
    }

    /** Normalise a mesh so its bottom sits exactly at y=0 of its parent group. */
    function floorPivot(mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        mesh.position.y -= box.min.y;
    }

    // ── Public API ────────────────────────────────────────────────────────────
    const api = {

        // Expose references needed by sahne.js
        get gridCols()  { return COLS; },
        get gridRows()  { return ROWS; },
        get character() { return character; },
        get controls()  { return controls; },
        get target()    { return target; },

        setRayOriginY(y) {
            rayStartY = y;
        },

        setHideOuterDome(val) {
            hideOuterDome = val;
        },

        setThemeLighting(ambientColor, ambientIntensity, pointColor, pointIntensity) {
            if (ambientLight) {
                ambientLight.color.setHex(ambientColor);
                ambientLight.intensity = ambientIntensity;
            }
            if (pointLight) {
                pointLight.color.setHex(pointColor);
                pointLight.intensity = pointIntensity;
                pointLight.position.set(gridCX, 3, gridCZ); // Glow from the island center
            }
        },

        /** Manually fix the grid centre to a specific world XZ point.
         *  Call BEFORE loadEnvironment or right after for instant effect. */
        setGridCentre(wx, wz) {
            gridCX = wx;
            gridCZ = wz;
            gridManual = true;
            buildGrid();
            placeTarget();
        },

        /** Re-enable auto-detection for the next era. */
        resetGridCentre() {
            gridManual = false;
            gridCX = 0;
            gridCZ = 0;
        },

        init(containerId) {
            const container = document.getElementById(containerId);
            if (!container || renderer) return; // Don't re-init

            scene    = new THREE.Scene();
            clock    = new THREE.Clock();

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.outputEncoding = THREE.sRGBEncoding;
            container.appendChild(renderer.domElement);

            camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 500);
            camera.position.set(0, 12, 18);
            camera.lookAt(0, 0, 0);

            scene.add(new THREE.AmbientLight(0xffffff, 0.2)); // Baseline low light
            
            ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
            scene.add(ambientLight);
            
            directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            scene.add(directionalLight);

            pointLight = new THREE.PointLight(0x00ffff, 0, 50); // Glowing point for mushroom centers etc.
            scene.add(pointLight);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping   = true;
            controls.dampingFactor   = 0.06;
            controls.maxPolarAngle   = Math.PI / 2.1;
            controls.minDistance     = 6;
            controls.maxDistance     = 22;

            // Shadow disc for character
            const sGeo = new THREE.CircleGeometry(0.7, 32);
            const sMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, side: THREE.DoubleSide });
            shadowDisc = new THREE.Mesh(sGeo, sMat);
            shadowDisc.rotation.x = -Math.PI / 2;
            scene.add(shadowDisc);

            this._loop();

            window.addEventListener('resize', () => {
                if (!camera || !renderer) return;
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        },

        /** Remove era-specific objects, keep character & bipbop. */
        clearEra() {
            if (environment) { scene.remove(environment); environment = null; }
            if (target)      { scene.remove(target);      target = null; }
            if (hologrid)    { scene.remove(hologrid);    hologrid = null; }
            envMixers = [];
        },

        async loadEnvironment(path, offset = { x: 0, y: 0, z: 0 }, scale = 30) {
            this.clearEra();

            const mesh = await loadGLTF(path, mx => envMixers.push(mx));

            // Get raw (unscaled) bbox to compute scale factor
            const rawBox  = new THREE.Box3().setFromObject(mesh);
            const rawSize = rawBox.getSize(new THREE.Vector3());
            const s = scale / Math.max(rawSize.x, rawSize.z);
            mesh.scale.set(s, s, s);
            mesh.updateMatrixWorld(true);

            // Now re-read bbox in scaled space and floor+centre
            const scaledBox    = new THREE.Box3().setFromObject(mesh);
            const scaledCentre = scaledBox.getCenter(new THREE.Vector3());

            const group = new THREE.Group();
            mesh.position.set(-scaledCentre.x, -scaledBox.min.y, -scaledCentre.z);
            group.position.set(offset.x, offset.y, offset.z);
            group.add(mesh);

            if (hideOuterDome) {
                group.traverse(child => {
                    if (child.isMesh) {
                        child.geometry.computeBoundingSphere();
                        const r = child.geometry.boundingSphere ? child.geometry.boundingSphere.radius : 0;
                        // Outer dome logic: keep visible for texture/bg but disable for grid/snapping
                        // Use a high threshold relative to scale to avoid disabling the floor
                        if (r > scale * 0.8 || child.name.toLowerCase().includes("dome") || child.name.toLowerCase().includes("sky") || child.name.toLowerCase().includes("sphere")) {
                            child.raycast = function() {}; // fully ignore collisions
                            if (child.material) {
                                child.material.side = THREE.DoubleSide; // see from inside
                                child.material.transparent = true;
                                child.material.opacity = Math.max(child.material.opacity, 0.9);
                            }
                        }
                    }
                });
            }

            environment = group;
            scene.add(environment);
            environment.updateMatrixWorld(true);

            // Tune scan radius relative to scale — cap at 40 world-units
            // so we only look in the area where the model sits (near origin)
            scanR = Math.min(scale * 0.35, 40);

            buildGrid();
            placeTarget();
            hoverY = 0;
        },

        async loadCharacter(path) {
            if (character) { scene.remove(character); character = null; charMixers = []; }

            const mesh = await loadGLTF(path, mx => charMixers.push(mx));
            mesh.scale.set(1.5, 1.5, 1.5);
            mesh.rotation.y = 0;
            floorPivot(mesh);

            const group = new THREE.Group();
            group.add(mesh);

            const wp = cellToWorld(0, 0);
            const y  = sampleY(wp.x, wp.z) ?? 0;
            group.position.set(wp.x, y, wp.z);
            hoverY = y;
            targetPos.set(wp.x, y, wp.z);
            targetRotY = group.rotation.y;

            character = group;
            scene.add(character);
        },

        async loadBipBop(path) {
            if (bipBop) { scene.remove(bipBop); bipBop = null; }

            const mesh = await loadGLTF(path, mx => charMixers.push(mx));
            mesh.scale.set(0.8, 0.8, 0.8);
            floorPivot(mesh);

            const wp = cellToWorld(0, 0);
            const y  = sampleY(wp.x, wp.z) ?? 0;
            mesh.position.set(wp.x + 2.2, y + 1.8, wp.z);

            bipBop = mesh;
            scene.add(bipBop);
        },

        async loadTarget(path) {
            if (target) { scene.remove(target); target = null; }

            const mesh = await loadGLTF(path, mx => envMixers.push(mx));
            mesh.scale.set(1.5, 1.5, 1.5);
            floorPivot(mesh);

            const group = new THREE.Group();
            group.add(mesh);
            target = group;
            scene.add(target);

            placeTarget();
        },

        /**
         * Called every frame from sahne.js.
         * pos = { x: col, z: row } in grid space
         * rot = degrees (Y rotation)
         */
        update(pos, rot) {
            if (!character) return;
            const wp      = cellToWorld(pos.x, pos.z);
            const groundY = sampleY(wp.x, wp.z) ?? 0;
            
            targetPos.set(wp.x, groundY, wp.z);
            targetRotY = THREE.MathUtils.degToRad(rot);
        },

        _loop() {
            requestAnimationFrame(() => this._loop());
            const dt = clock.getDelta();
            
            // Continuous smooth tracking for animations
            if (character) {
                // Smooth vertical snapping to terrain independently
                hoverY += (targetPos.y - hoverY) * 0.15;
                
                // Lerp Character X/Z and Y
                character.position.lerp(new THREE.Vector3(targetPos.x, hoverY, targetPos.z), 0.15);
                
                // Lerp Rotation (handle angle wrapping)
                let diff = targetRotY - character.rotation.y;
                while (diff < -Math.PI) diff += Math.PI * 2;
                while (diff > Math.PI)  diff -= Math.PI * 2;
                character.rotation.y += diff * 0.15;

                // Sync shadow and camera
                if (shadowDisc) shadowDisc.position.set(character.position.x, targetPos.y + 0.04, character.position.z);
                if (controls) controls.target.lerp(new THREE.Vector3(character.position.x, hoverY + 0.5, character.position.z), 0.08);

                // BipBop floats to the character's RIGHT side continuously
                if (bipBop) {
                    const rightAngle = character.rotation.y + Math.PI / 2;
                    const bx = character.position.x + Math.sin(rightAngle) * 1.8;
                    const bz = character.position.z + Math.cos(rightAngle) * 1.8;
                    const by = hoverY + 1.35 + Math.sin(Date.now() * 0.003) * 0.18;

                    bipBop.position.lerp(new THREE.Vector3(bx, by, bz), 0.1);
                    bipBop.lookAt(new THREE.Vector3(character.position.x, hoverY + 0.6, character.position.z));
                }
            }

            if (target) target.rotation.y += 0.016;

            envMixers.forEach(m  => m.update(dt));
            charMixers.forEach(m => m.update(dt));
            controls?.update();
            renderer?.render(scene, camera);
        }
    };

    return api;
})();
