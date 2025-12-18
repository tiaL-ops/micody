// Earth particle system
class EarthParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 80;
        
        // Use irregular geometries that look better when non-uniformly scaled
        this.rockGeometries = [
            new THREE.IcosahedronGeometry(0.07, 0), // Very jagged
            new THREE.DodecahedronGeometry(0.06, 0), 
            new THREE.TetrahedronGeometry(0.08, 0)
        ];
        
        // Earth colors - earthy browns, charcoals, and clay
        this.earthColors = [0x5C4033, 0x4B3621, 0x3B2F2F, 0x63462D, 0x2A1B0E];
    }
    
    spawnRocks(screenX, screenY, camera) {

        const flippedX = window.innerWidth - screenX;
        const ndcX = (flippedX  / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        
        for (let i = 0; i < 2; i++) {
            if (this.particles.length >= this.maxParticles) {
                const old = this.particles.shift();
                this.scene.remove(old.mesh);
                // Only dispose if you're creating unique geometries per particle
            }
            
            const geometry = this.rockGeometries[Math.floor(Math.random() * this.rockGeometries.length)];
            const baseColor = this.earthColors[Math.floor(Math.random() * this.earthColors.length)];
            
            // UPGRADED MATERIAL: Standard PBR for matte rock look
            const material = new THREE.MeshStandardMaterial({
                color: baseColor,
                roughness: 0.9,      // Rocks aren't shiny
                metalness: 0.1,      // Slight mineral glint
                flatShading: true,
                transparent: true,
                opacity: 1.0
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            // REALISM TRICK: Non-uniform scaling
            // This makes the same geometry look like different rocks
            particle.scale.set(
                0.5 + Math.random() * 1.2,
                0.5 + Math.random() * 1.2,
                0.5 + Math.random() * 1.2
            );
            
            particle.position.set(
                vector.x + (Math.random() - 0.5) * 0.3,
                vector.y + (Math.random() - 0.5) * 0.2,
                vector.z
            );
            
            const data = {
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    -0.06 - Math.random() * 0.06, 
                    (Math.random() - 0.5) * 0.04
                ),
                gravity: -0.006, // Heavier than water
                life: 1.0,
                age: 0,
                rotation: {
                    x: (Math.random() - 0.5) * 0.15,
                    y: (Math.random() - 0.5) * 0.15,
                    z: (Math.random() - 0.5) * 0.15
                }
            };
            
            this.scene.add(particle);
            this.particles.push(data);
        }
    }
    
    update() {
        this.particles = this.particles.filter(p => {
            p.velocity.y += p.gravity;
            p.mesh.position.add(p.velocity);
            
            p.mesh.rotation.x += p.rotation.x;
            p.mesh.rotation.y += p.rotation.y;
            p.mesh.rotation.z += p.rotation.z;
            
            p.age += 0.016;
            p.life = 1.0 - (p.age / 2.5); 
            
            // Fade out near the end of life
            if (p.life < 0.2) {
                p.mesh.material.opacity = p.life * 5;
            }
            
            if (p.life <= 0 || p.mesh.position.y < -5) {
                this.scene.remove(p.mesh);
                p.mesh.material.dispose();
                return false;
            }
            return true;
        });
    }
    
    createDustCloud(x, y, camera) {

        const flippedX = window.innerWidth - x;

        const ndcX = (x / flippedX)  * 2 - 1;
        const ndcY = -(y / window.innerHeight) * 2 + 1;
        const vector = new THREE.Vector3(ndcX, ndcY - 0.3, 0.5);
        vector.unproject(camera);
        
        // Impact dust
        for (let i = 0; i < 8; i++) {
            const dustGeometry = new THREE.DodecahedronGeometry(0.04, 0);
            const dustMaterial = new THREE.MeshLambertMaterial({
                color: 0x8B7355,
                transparent: true,
                opacity: 0.5
            });
            
            const dust = new THREE.Mesh(dustGeometry, dustMaterial);
            dust.position.set(
                vector.x + (Math.random() - 0.5) * 0.5,
                vector.y - 2,
                vector.z
            );
            
            this.scene.add(dust);
            
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.06,
                Math.random() * 0.03,
                (Math.random() - 0.5) * 0.06
            );
            
            let opacity = 0.5;
            const animate = () => {
                dust.position.add(velocity);
                opacity -= 0.02;
                dust.material.opacity = Math.max(0, opacity);
                dust.scale.multiplyScalar(1.02);
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    this.scene.remove(dust);
                    dust.geometry.dispose();
                    dust.material.dispose();
                }
            };
            animate();
        }
    }
    
    dispose() {
        this.particles.forEach(p => {
            this.scene.remove(p.mesh);
            p.mesh.material.dispose();
        });
        this.particles = [];
        this.rockGeometries.forEach(geo => geo.dispose());
    }
}