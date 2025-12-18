class WaterParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 100;
        
        // Use a slightly more detailed geometry for better light reflections
        this.particleGeometry = new THREE.IcosahedronGeometry(0.06, 1);
        
        // UPGRADED MATERIAL: Physical Water properties
        this.particleMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0077ff,        // Pure white (let the transmission handle color)
            transmission: 0.95,     // Transparent like glass/water
            opacity: 1,
            roughness: 0,           // Perfectly smooth
            metalness: 0,
            ior: 1.333,             // Index of Refraction for Water
            thickness: 0.2,         // Depth of the droplet
            specularIntensity: 1,   // High highlights
            clearcoat: 1.0          // Extra "wet" shine
        });
        
        this.splashGeometry = new THREE.RingGeometry(0.05, 0.15, 16);
        this.splashMaterial = new THREE.MeshBasicMaterial({
            color: 0xdef3ff,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide
        });
    }
    
    spawnDroplets(screenX, screenY, camera) {
        const ndcX = (screenX / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        
        for (let i = 0; i < 2; i++) {
            if (this.particles.length >= this.maxParticles) {
                const old = this.particles.shift();
                this.scene.remove(old.mesh);
                // Important: Don't dispose if you are sharing geometry/material
            }
            
            const particle = new THREE.Mesh(
                this.particleGeometry, // Shared reference is faster
                this.particleMaterial.clone() // Clone material to vary opacity per particle
            );
            
            particle.position.set(
                vector.x + (Math.random() - 0.5) * 0.1,
                vector.y + (Math.random() - 0.5) * 0.1,
                vector.z
            );
            
            const data = {
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    -0.05 - Math.random() * 0.05,
                    (Math.random() - 0.5) * 0.02
                ),
                gravity: -0.004,
                life: 1.0,
                age: 0
            };
            
            this.scene.add(particle);
            this.particles.push(data);
        }
    }
    
    update() {
        this.particles = this.particles.filter(p => {
            p.velocity.y += p.gravity;
            p.mesh.position.add(p.velocity);
            
            // --- NEW: FLOW EFFECT ---
            // Makes the sphere stretch in the direction it's falling
            const speed = p.velocity.length();
            p.mesh.lookAt(p.mesh.position.clone().add(p.velocity));
            p.mesh.scale.set(1, 1, 1 + speed * 15); // Stretch along the Z axis based on speed
            
            p.age += 0.016;
            p.life = 1.0 - (p.age / 2.0); 
            
            p.mesh.material.opacity = Math.max(0, p.life);
            
            if (p.life <= 0 || p.mesh.position.y < -5) {
                this.scene.remove(p.mesh);
                p.mesh.material.dispose();
                return false;
            }
            return true;
        });
    }

    
    // Create splash effect on ground
    createSplash(x, y, camera) {
        const ndcX = (x / window.innerWidth) * 2 - 1;
        const ndcY = -(y / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(ndcX, ndcY - 0.3, 0.5);
        vector.unproject(camera);
        
        const splash = new THREE.Mesh(
            this.splashGeometry.clone(),
            this.splashMaterial.clone()
        );
        
        splash.position.set(vector.x, vector.y - 2, vector.z);
        splash.rotation.x = -Math.PI / 2;  // Lay flat
        
        this.scene.add(splash);
        
        // Animate splash expansion
        let scale = 0.1;
        let opacity = 0.8;
        const animate = () => {
            scale += 0.15;
            opacity -= 0.05;
            
            splash.scale.set(scale, scale, 1);
            splash.material.opacity = Math.max(0, opacity);
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.scene.remove(splash);
                splash.geometry.dispose();
                splash.material.dispose();
            }
        };
        animate();
    }
    
    // Cleanup
    dispose() {
        this.particles.forEach(p => {
            this.scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        });
        this.particles = [];
        this.particleGeometry.dispose();
        this.particleMaterial.dispose();
        this.splashGeometry.dispose();
        this.splashMaterial.dispose();
    }
}

// Export for use in main
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WaterParticleSystem;
}