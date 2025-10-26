// Three.js Dance Sequence System (improved - jointed avatar + example moves)
//DO NOT MODIFY THIS FILE.
class DanceSequence {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.character = null;
        this.moves = [];
        this.currentMoveIndex = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.moveStartTime = 0;
        this.moveDuration = 3000; // default 3s
        this.activeMoveClearer = null; // function to clear active animation (intervals/timeouts)
        this.init();
    }

    async init() {
        this.setupThreeJS();
        this.createCharacter();
        await this.loadMoves();
        this.setupUI();
        this.animate();
    }

    setupThreeJS() {
        const canvas = document.getElementById('canvas');
        const container = document.getElementById('container');

        // Scene
        this.scene = new THREE.Scene();
        // subtle gradient background via canvas texture
        const bg = document.createElement('canvas');
        bg.width = 16;
        bg.height = 256;
        const ctx = bg.getContext('2d');
        const g = ctx.createLinearGradient(0, 0, 0, 256);
        g.addColorStop(0, '#0f1724');
        g.addColorStop(1, '#07102a');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 16, 256);
        this.scene.background = new THREE.CanvasTexture(bg);

        // Fog adds depth
        this.scene.fog = new THREE.FogExp2(0x07102a, 0.03);

        // Camera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 2.2, 5);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Lights: ambient + rim + key
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
        this.scene.add(ambientLight);

        const rimLight = new THREE.DirectionalLight(0x88ccff, 0.4);
        rimLight.position.set(-6, 4, -2);
        this.scene.add(rimLight);

        const keyLight = new THREE.SpotLight(0xffffff, 0.9);
        keyLight.position.set(5, 8, 5);
        keyLight.angle = Math.PI / 6;
        keyLight.penumbra = 0.3;
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        this.scene.add(keyLight);

        // Ground with subtle grid
        const groundGeo = new THREE.PlaneGeometry(40, 40);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x11131a, metalness: 0.1, roughness: 0.9 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // soft grid helper
        const grid = new THREE.GridHelper(20, 20, 0x2a3340, 0x17202a);
        grid.material.opacity = 0.6;
        grid.material.transparent = true;
        this.scene.add(grid);

        // Resize handling
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // helper: create a limb segment (group pivot + mesh centered for rotation)
    createSegment(length = 1, radius = 0.08, color = 0xffffff) {
        const segGroup = new THREE.Group(); // pivot group at joint
        const geo = new THREE.CylinderGeometry(radius, radius, length, 12);
        const mat = new THREE.MeshStandardMaterial({ color, metalness: 0.1, roughness: 0.6 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = false;
        // Position cylinder such that its top is at the group's origin (so rotation at top joint behaves like a bone)
        mesh.position.y = -length / 2;
        segGroup.add(mesh);

        // store reference for easy access
        segGroup.userData.mesh = mesh;
        segGroup.userData.length = length;
        return segGroup;
    }

    createCharacter() {
        this.character = new THREE.Group();
      
        // === Materials ===
        const skinMat = new THREE.MeshStandardMaterial({
          color: 0xffe0bd,
          roughness: 0.5,
          metalness: 0.1
        });
        const clothMat = new THREE.MeshStandardMaterial({
          color: 0x4a90e2,
          roughness: 0.4,
          metalness: 0.2
        });
        const pantMat = new THREE.MeshStandardMaterial({
          color: 0x1f2a44,
          roughness: 0.6
        });
        const shoeMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x111111
        });
        const glowMat = new THREE.MeshStandardMaterial({
          color: 0x00aaff,
          emissive: 0x00ccff,
          emissiveIntensity: 0.4
        });
      
        // === Head ===
        const head = new THREE.Group();
        const skull = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), skinMat);
        skull.position.y = 1.55;
        head.add(skull);
      
        // Eyes
        const eyeGeo = new THREE.SphereGeometry(0.04, 12, 12);
        const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });
        const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
        leftEye.position.set(-0.1, 1.58, 0.32);
        const rightEye = leftEye.clone();
        rightEye.position.x = 0.1;
        head.add(leftEye, rightEye);
      
        // Hair cap
        const hair = new THREE.Mesh(
          new THREE.SphereGeometry(0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2),
          new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.7, metalness: 0.4 })
        );
        hair.position.y = 1.56;
        head.add(hair);
      
        // === Torso ===
        const torso = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 0.9, 8, 1),
          clothMat
        );
        torso.position.y = 0.7;
       
        // === Arms ===
        const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8, 1);
        const leftArm = new THREE.Mesh(armGeo, skinMat);
        const rightArm = leftArm.clone();
      
        leftArm.position.set(-0.38, 1.1, 0);
        rightArm.position.set(0.38, 1.1, 0);
        leftArm.rotation.z = Math.PI / 8;
        rightArm.rotation.z = -Math.PI / 8;
      
        // === Legs ===
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8, 1);
        const leftLeg = new THREE.Mesh(legGeo, pantMat);
        const rightLeg = leftLeg.clone();
      
        leftLeg.position.set(-0.18, -0.3, 0);
        rightLeg.position.set(0.18, -0.3, 0);
      
        // === Shoes ===
        const shoeGeo = new THREE.BoxGeometry(0.25, 0.1, 0.45);
        const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
        const rightShoe = leftShoe.clone();
        leftShoe.position.set(-0.18, -0.75, 0.05);
        rightShoe.position.set(0.18, -0.75, 0.05);
      
        // === Glow accent (neck ring / futuristic necklace) ===
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.025, 8, 32), glowMat);
        ring.position.y = 1.05;
        this.character.add(ring);
      
        // === Assemble ===
        this.character.add(head, torso, leftArm, rightArm, leftLeg, rightLeg, leftShoe, rightShoe);
        
        // === Setup userData.parts for move functions ===
        this.character.userData.parts = {
            // Head and neck
            head: head,
            neck: head, 
            
            // Torso and hips
            torso: torso,
            hips: torso, 
            
            // Arms
            leftUpper: leftArm,
            leftLower: leftArm,
            rightUpper: rightArm,
            rightLower: rightArm, 
            
            // Legs
            leftUpperLeg: leftLeg,
            leftLowerLeg: leftLeg,
            rightUpperLeg: rightLeg,
            rightLowerLeg: rightLeg, 
            
            // Feet
            leftFoot: leftShoe,
            rightFoot: rightShoe
        };
        
        // === Store original transforms for reset ===
        this.character.traverse((node) => {
            if (node.isMesh || node.isGroup) {
                node.userData.original = {
                    position: node.position.clone(),
                    rotation: node.rotation.clone(),
                    scale: node.scale.clone()
                };
            }
        });
      
        // === Soft reflection floor ===
        const floorGeo = new THREE.CircleGeometry(4, 64);
        const floorMat = new THREE.MeshStandardMaterial({
          color: 0x111111,
          roughness: 0.1,
          metalness: 1,
          envMapIntensity: 1
        });
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.8;
        floor.receiveShadow = true;
        this.scene.add(floor);
      
        // === Scene polish ===
        this.scene.background = new THREE.Color(0x070a15);
        this.scene.fog = new THREE.Fog(0x070a15, 6, 12);
      
        // Lights for glow & depth
        const fill = new THREE.PointLight(0x00aaff, 0.6, 10);
        fill.position.set(0, 2, 2);
        this.scene.add(fill);
      
        const key = new THREE.DirectionalLight(0xffffff, 0.8);
        key.position.set(4, 6, 3);
        key.castShadow = true;
        this.scene.add(key);
      
        // Shadows
        [head, torso, leftArm, rightArm, leftLeg, rightLeg, leftShoe, rightShoe].forEach(m => {
          m.castShadow = true;
        });
      
        this.character.position.set(0, 0, 0);
        this.scene.add(this.character);
      }
      
       
  

    // load custom moves (contributors.json) but fallback to built-in moves if none
    async loadMoves() {
        let loaded = false;
        try {
            const response = await fetch('contributors.json');
            if (!response.ok) throw new Error('no contributors.json');
            const contributors = await response.json();

            for (const contributor of contributors) {
                if (contributor.moveFile) {
                    try {
                        const moveModule = await import(`../moves/${contributor.moveFile}`);
                        const moveFunction = moveModule.default;
                        if (typeof moveFunction === 'function') {
                            this.moves.push({
                                name: contributor.name,
                                move: moveFunction,
                                duration: contributor.duration || 3000
                            });
                            console.log(`✅ Loaded move: ${contributor.name} (${contributor.moveFile})`);
                        } else {
                            console.warn(`❌ Move function not found in ${contributor.moveFile}`);
                        }
                        loaded = true;
                    } catch (err) {
                        console.warn(`❌ Failed to load move ${contributor.moveFile}:`, err);
                    }
                }
            }
        } catch (err) {
            // fail silently; we'll add built-in moves
            console.warn('Could not load contributors.json or moves — using built-in moves.', err);
        }

        // if no moves loaded, add built-in example moves
        if (!loaded) {
            this.addBuiltInMoves();
        }

        this.updateUI();
        const loadingEl = document.getElementById('loading');
        if (loadingEl) loadingEl.style.display = 'none';
    }

    addBuiltInMoves() {
        // Example move: sway (torso sway + subtle leg shift)
        const sway = (root) => {
            this.clearActiveMove();
            const parts = root.userData.parts;
            const duration = 2500;
            const start = Date.now();
            const interval = 16;
            const id = setInterval(() => {
                const t = (Date.now() - start) / duration;
                if (t >= 1) {
                    clearInterval(id);
                    return;
                }
                const angle = Math.sin(t * Math.PI * 2) * 0.12; // sway angle
                parts.torso.rotation.z = angle;
                // subtle hips counter rotation
                parts.hips.rotation.z = -angle * 0.5;
                // small head bob
                parts.neck.rotation.x = Math.sin(t * Math.PI * 2) * 0.06;
            }, interval);

            this.activeMoveClearer = () => clearInterval(id);
        };

        // Example move: wave hands (right hand waves, left follows)
        const waveHands = (root) => {
            this.clearActiveMove();
            const parts = root.userData.parts;
            const duration = 2200;
            const start = Date.now();
            const interval = 16;
            const id = setInterval(() => {
                const t = (Date.now() - start) / duration;
                if (t >= 1) {
                    clearInterval(id);
                    // return hand rotations to neutral gradually
                    parts.rightUpper.rotation.z = -Math.PI / 8;
                    parts.rightLower.rotation.x = 0;
                    parts.leftUpper.rotation.z = Math.PI / 8;
                    parts.leftLower.rotation.x = 0;
                    return;
                }
                // waving function
                const wave = Math.sin(t * Math.PI * 6) * 0.7; // faster wave
                // rotate at shoulder (raise)
                parts.rightUpper.rotation.x = -Math.PI / 3 + wave * 0.2;
                parts.rightLower.rotation.x = Math.sin(t * Math.PI * 3) * 0.8;
                // left hand mirrors with smaller amplitude
                parts.leftUpper.rotation.x = -Math.PI / 4 + Math.sin(t * Math.PI * 6 + Math.PI) * 0.12;
                parts.leftLower.rotation.x = Math.sin(t * Math.PI * 3 + Math.PI) * 0.4;
            }, interval);

            this.activeMoveClearer = () => clearInterval(id);
        };

        // Example move: stomp (leg movement + camera slight shake)
        const stomp = (root) => {
            this.clearActiveMove();
            const parts = root.userData.parts;
            const duration = 2000;
            const cycles = 4;
            const start = Date.now();
            const interval = 16;
            const id = setInterval(() => {
                const elapsed = Date.now() - start;
                const t = elapsed / duration;
                if (t >= 1) {
                    clearInterval(id);
                    // reset foot rotations
                    parts.leftUpperLeg.rotation.x = 0;
                    parts.rightUpperLeg.rotation.x = 0;
                    return;
                }
                const beat = Math.floor(t * cycles);
                const phase = (t * cycles) - beat; // 0..1 in each beat
                const stompPower = Math.sin(phase * Math.PI) * 0.8;
                // alternate legs per beat
                if (beat % 2 === 0) {
                    parts.leftUpperLeg.rotation.x = -0.2 - stompPower * 0.5;
                    parts.rightUpperLeg.rotation.x = -0.05;
                } else {
                    parts.rightUpperLeg.rotation.x = -0.2 - stompPower * 0.5;
                    parts.leftUpperLeg.rotation.x = -0.05;
                }
            }, interval);

            this.activeMoveClearer = () => clearInterval(id);
        };

        this.moves.push({ name: 'Sway', move: sway, duration: 2500 });
        this.moves.push({ name: 'Wave Hands', move: waveHands, duration: 2200 });
        this.moves.push({ name: 'Stomp', move: stomp, duration: 2000 });
    }

    setupUI() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (playBtn) playBtn.addEventListener('click', () => this.play());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
        if (resetBtn) resetBtn.addEventListener('click', () => this.reset());
    }

    play() {
        if (this.moves.length === 0) return;
        this.isPlaying = true;
        this.isPaused = false;
        if (this.currentMoveIndex >= this.moves.length) this.currentMoveIndex = 0;
        this.startCurrentMove();
    }

    pause() {
        this.isPlaying = false;
        this.isPaused = true;
        // stop active move but preserve pose
        this.clearActiveMove();
    }

    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentMoveIndex = 0;
        this.clearActiveMove();
        this.resetCharacter();
        this.updateUI();
    }

    startCurrentMove() {
        if (this.currentMoveIndex >= this.moves.length) return;
        const currentMove = this.moves[this.currentMoveIndex];
        this.moveStartTime = Date.now();
        this.moveDuration = currentMove.duration || this.moveDuration;

        // reset to default before starting move
        this.resetCharacter();

        // Execute move and capture clearer
        try {
            console.log(`🎭 Executing move: ${currentMove.name}`);
            currentMove.move(this.character);
        } catch (err) {
            console.error(`❌ Move function "${currentMove.name}" threw an error:`, err);
        }

        this.updateUI();

        // Schedule next move (respecting play/pause state)
        this.moveTimeout = setTimeout(() => {
            if (this.isPlaying && !this.isPaused) {
                this.currentMoveIndex++;
                if (this.currentMoveIndex >= this.moves.length) this.currentMoveIndex = 0;
                this.startCurrentMove();
            }
        }, this.moveDuration);
    }

    clearActiveMove() {
        // Clear intervals/timeouts created by move functions
        if (this.activeMoveClearer) {
            try { this.activeMoveClearer(); } catch (e) { /* ignore */ }
            this.activeMoveClearer = null;
        }
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
            this.moveTimeout = null;
        }
    }

    resetCharacter() {
        // Reset transforms using userData.original
        this.character.traverse((node) => {
            if (node.userData && node.userData.original) {
                node.position.copy(node.userData.original.position);
                node.rotation.copy(node.userData.original.rotation);
                node.scale.copy(node.userData.original.scale);
            }
        });
    }

    updateUI() {
        if (this.moves.length > 0 && this.currentMoveIndex < this.moves.length) {
            const currentMove = this.moves[this.currentMoveIndex];
            const elName = document.getElementById('current-move-name');
            const elDur = document.getElementById('move-duration');
            if (elName) elName.textContent = currentMove.name;
            if (elDur) elDur.textContent = (currentMove.duration / 1000).toFixed(1);
        }

        const total = document.getElementById('total-moves');
        const total2 = document.getElementById('total-moves-2');
        const idx = document.getElementById('current-index');
        if (total) total.textContent = this.moves.length;
        if (total2) total2.textContent = this.moves.length;
        if (idx) idx.textContent = this.currentMoveIndex + 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // simple camera slow orbit for dynamic view
        const t = Date.now() * 0.0002;
        this.camera.position.x = Math.sin(t) * 2;
        this.camera.position.z = 4 + Math.cos(t) * 0.5;
        this.camera.lookAt(new THREE.Vector3(0, 0.8, 0));

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dance = new DanceSequence(); // expose for debugging / external control
});
