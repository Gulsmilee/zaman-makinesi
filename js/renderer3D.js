window.renderer3D = {
    scene: null,
    camera: null,
    renderer: null,
    clock: new THREE.Clock(),
    
    environment: null,
    character: null,
    bipBop: null,
    target: null,
    shadowDisc: null,
    hologrid: null,
    controls: null,
    charHeight: 0,
    
    mixers: [],
    
    gridScale: 2.0, 
    
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        this.scene = new THREE.Scene();
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 6, 12); 
        this.camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(10, 20, 10);
        this.scene.add(dirLight);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 20;

        this.createHologrid();

        const shadowGeo = new THREE.CircleGeometry(0.8, 32);
        const shadowMat = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            transparent: true, 
            opacity: 0.4,
            side: THREE.DoubleSide 
        });
        this.shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
        this.shadowDisc.rotation.x = Math.PI / 2;
        this.shadowDisc.position.y = 0.02; 
        this.scene.add(this.shadowDisc);

        this.animate();
        
        window.addEventListener('resize', () => this.onResize(container));
    },

    createHologrid() {
        if (this.hologrid) this.scene.remove(this.hologrid);
        
        const gridGroup = new THREE.Group();
        const size = 5 * this.gridScale;
        const detail = 5;
        
        const planeGeo = new THREE.PlaneGeometry(size, size);
        const planeMat = new THREE.MeshBasicMaterial({ 
            color: 0x9eff00, 
            transparent: true, 
            opacity: 0.05, 
            side: THREE.DoubleSide 
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = Math.PI / 2;
        gridGroup.add(plane);

        const lineMat = new THREE.LineBasicMaterial({ color: 0x9eff00, transparent: true, opacity: 0.3 });
        for(let i=0; i<=detail; i++) {
            const offset = (i / detail - 0.5) * size;
            
            const pointsX = [new THREE.Vector3(offset, 0.01, -size/2), new THREE.Vector3(offset, 0.01, size/2)];
            const geoX = new THREE.BufferGeometry().setFromPoints(pointsX);
            gridGroup.add(new THREE.Line(geoX, lineMat));

            const pointsZ = [new THREE.Vector3(-size/2, 0.01, offset), new THREE.Vector3(size/2, 0.01, offset)];
            const geoZ = new THREE.BufferGeometry().setFromPoints(pointsZ);
            gridGroup.add(new THREE.Line(geoZ, lineMat));
        }

        this.hologrid = gridGroup;
        this.scene.add(this.hologrid);
    },

    onResize(container) {
        if (!this.camera || !this.renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    },

    clearEra() {
        if (this.environment) this.scene.remove(this.environment);
        if (this.target) this.scene.remove(this.target);
        this.mixers = [];
    },

    async loadEnvironment(path, offset = {x:0, y:0, z:0}, customScale = 30, charHeight = 0, targetPath = null) {
        this.clearEra();
        this.charHeight = charHeight;
        const loader = new THREE.GLTFLoader();
        
        const envPromise = new Promise((resolve) => {
            loader.load(path, (gltf) => {
                this.environment = gltf.scene;
                const box = new THREE.Box3().setFromObject(this.environment);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                this.environment.position.x -= center.x;
                this.environment.position.z -= center.z;
                this.environment.position.y -= box.min.y;
                
                this.environment.position.x += offset.x;
                this.environment.position.y += offset.y;
                this.environment.position.z += offset.z;
                
                const maxDim = Math.max(size.x, size.z);
                const scale = customScale / maxDim; 
                this.environment.scale.set(scale, scale, scale);
                
                this.scene.add(this.environment);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(this.environment);
                    gltf.animations.forEach(clip => mixer.clipAction(clip).play());
                    this.mixers.push(mixer);
                }
                resolve();
            });
        });

        const targetPromise = targetPath ? new Promise((resolve) => {
            loader.load(targetPath, (gltf) => {
                this.target = gltf.scene;
                this.target.scale.set(1.5, 1.5, 1.5);
                
                const gridX = 2; 
                const gridZ = 2; 
                const worldX = (gridX - 2) * this.gridScale;
                const worldZ = (gridZ - 2) * this.gridScale;
                
                this.target.position.set(worldX, this.charHeight + 0.1, worldZ);
                this.scene.add(this.target);

                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(this.target);
                    gltf.animations.forEach(clip => mixer.clipAction(clip).play());
                    this.mixers.push(mixer);
                }
                resolve();
            });
        }) : Promise.resolve();

        return Promise.all([envPromise, targetPromise]);
    },

    async loadCharacter(path) {
        if (this.character) this.scene.remove(this.character);
        const loader = new THREE.GLTFLoader();
        
        return new Promise((resolve) => {
            loader.load(path, (gltf) => {
                this.character = gltf.scene;
                this.character.scale.set(1.5, 1.5, 1.5); 
                this.scene.add(this.character);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(this.character);
                    mixer.clipAction(gltf.animations[0]).play();
                    this.mixers.push(mixer);
                }
                resolve();
            });
        });
    },

    async loadBipBop(path) {
        if (this.bipBop) this.scene.remove(this.bipBop);
        const loader = new THREE.GLTFLoader();
        
        return new Promise((resolve) => {
            loader.load(path, (gltf) => {
                this.bipBop = gltf.scene;
                this.bipBop.scale.set(0.8, 0.8, 0.8); 
                this.scene.add(this.bipBop);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(this.bipBop);
                    mixer.clipAction(gltf.animations[0]).play();
                    this.mixers.push(mixer);
                }
                resolve();
            });
        });
    },

    async loadTarget(path) {
        if (this.target) this.scene.remove(this.target);
        const loader = new THREE.GLTFLoader();
        
        return new Promise((resolve) => {
            loader.load(path, (gltf) => {
                this.target = gltf.scene;
                this.target.scale.set(1.5, 1.5, 1.5);
                
                const gridX = 2;
                const gridZ = 2;
                const worldX = (gridX - 2) * this.gridScale;
                const worldZ = (gridZ - 2) * this.gridScale;
                
                this.target.position.set(worldX, this.charHeight + 0.1, worldZ);
                this.scene.add(this.target);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(this.target);
                    gltf.animations.forEach(clip => mixer.clipAction(clip).play());
                    this.mixers.push(mixer);
                }
                resolve();
            });
        });
    },

    raycaster: new THREE.Raycaster(),
    rayDown: new THREE.Vector3(0, -1, 0),
    currentHoverY: 2.0,

    update(pos, rot, targetPos) {
        if (this.character) {
            const worldX = (pos.x - 2) * this.gridScale;
            const worldZ = (pos.z - 2) * this.gridScale;
            
            let groundY = this.charHeight;
            
            if (this.environment) {
                const rayOrigin = new THREE.Vector3(worldX, 20, worldZ);
                this.raycaster.set(rayOrigin, this.rayDown);
                
                const intersects = this.raycaster.intersectObject(this.environment, true);
                if (intersects.length > 0) {
                    groundY = intersects[0].point.y;
                }
            }

            const targetY = groundY + 0.02;

            this.currentHoverY += (targetY - this.character.position.y) * 0.15;

            this.character.position.set(worldX, this.currentHoverY, worldZ); 
            
            this.character.rotation.y = THREE.MathUtils.degToRad(rot); 
            
            if (this.shadowDisc) {
                this.shadowDisc.position.set(worldX, groundY + 0.05, worldZ);
            }

            this.controls.target.lerp(new THREE.Vector3(worldX, this.currentHoverY + 0.5, worldZ), 0.1);
        }

        if (this.bipBop && this.character) {
            const hoverHeight = 1.0 + Math.sin(Date.now() * 0.003) * 0.2;
            const targetX = this.character.position.x - Math.sin(this.character.rotation.y) * 1.5;
            const targetZ = this.character.position.z - Math.cos(this.character.rotation.y) * 1.5;
            const targetY = this.character.position.y + hoverHeight;
            
            this.bipBop.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
            this.bipBop.lookAt(this.character.position);
        }

        if (this.target && this.environment) {
            const gridGoalX = 2;
            const gridGoalZ = 2;
            const tX = (gridGoalX - 2) * this.gridScale;
            const tZ = (gridGoalZ - 2) * this.gridScale;
            
            const rayOrigin = new THREE.Vector3(tX, 20, tZ);
            this.raycaster.set(rayOrigin, this.rayDown);
            const intersects = this.raycaster.intersectObject(this.environment, true);
            let groundT = this.charHeight;
            if (intersects.length > 0) groundT = intersects[0].point.y;

            this.target.position.set(tX, groundT, tZ);
            this.target.rotation.y += 0.01; 
        }
    },

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        this.mixers.forEach(mixer => mixer.update(delta));
        if (this.controls) this.controls.update();
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};
