// Fire particle system
class FireParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 150;
        
        // Fire colors - red, orange, yellow
        this.fireColors = [0xff0000, 0xff4500, 0xff6600, 0xff8800, 0xffaa00];
        
        // Flame geometry
        this.flameGeometry = new THREE.SphereGeometry(0.06, 8, 8);
    }
    
    // Spawn flames at both hand positions
    spawnFlames(leftX, leftY, rightX, rightY, camera) {
        // Spawn from left hand
        this.spawnFlameParticles(leftX, leftY, camera);
        // Spawn from right hand
        this.spawnFlameParticles(rightX, rightY, camera);
    }
    
    spawnFlameParticles(screenX, screenY, camera) {
        // FLIP the X coordinate to match webcam mirror
        const flippedX = window.innerWidth - screenX;
        
        const ndcX = (flippedX / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        
        // Spawn 3-4 flame particles per frame per hand
        for (let i = 0; i < 3; i++) {
            if (this.particles.length >= this.maxParticles) {
                const old = this.particles.shift();
                this.scene.remove(old.mesh);
                old.mesh.geometry.dispose();
                old.mesh.material.dispose();
            }
            
            const color = this.fireColors[Math.floor(Math.random() * this.fireColors.length)];
            
            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.9
            });
            
            const particle = new THREE.Mesh(this.flameGeometry.clone(), material);
            
            // Spawn closer to hand position with less randomness
            particle.position.set(
                vector.x + (Math.random() - 0.5) * 0.15,  // Reduced spread
                vector.y + (Math.random() - 0.5) * 0.1,   // Reduced spread
                vector.z
            );
            
            // Fire rises up!
            const data = {
                mesh: particle,
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    0.04 + Math.random() * 0.06,  // Rising upward
                    (Math.random() - 0.5) * 0.02
                ),
                life: 1.0,
                age: 0,
                baseColor: color,
                flickerSpeed: 0.5 + Math.random() * 0.5
            };
            
            this.scene.add(particle);
            this.particles.push(data);
        }
    }
    
    // Update all particles
    update() {
        this.particles = this.particles.filter(p => {
            // Update position - fire rises
            p.mesh.position.add(p.velocity);
            
            // Add slight sideways drift
            p.velocity.x += (Math.random() - 0.5) * 0.002;
            
            // Age and fade
            p.age += 0.016;
            p.life = 1.0 - (p.age / 1.5);  // 1.5 second lifespan
            
            // Fade to yellow/white as it burns
            const colorShift = 1.0 - p.life;
            p.mesh.material.opacity = Math.max(0, p.life * 0.9);
            
            // Scale down as it fades
            const scale = 0.5 + p.life * 0.5;
            p.mesh.scale.set(scale, scale, scale);
            
            // Remove if dead or too high
            if (p.life <= 0 || p.mesh.position.y > 5) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                return false;
            }
            
            return true;
        });
    }
    
    // Create fire burst effect
    createFireBurst(leftX, leftY, rightX, rightY, camera) {
        const positions = [
            {x: leftX, y: leftY},
            {x: rightX, y: rightY}
        ];
        
        positions.forEach(pos => {
            const flippedX = window.innerWidth - pos.x;
            const ndcX = (flippedX / window.innerWidth) * 2 - 1;
            const ndcY = -(pos.y / window.innerHeight) * 2 + 1;
            
            const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
            vector.unproject(camera);
            
            // Create burst particles
            for (let i = 0; i < 12; i++) {
                const burstGeometry = new THREE.SphereGeometry(0.04, 6, 6);
                const burstMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff4500,
                    transparent: true,
                    opacity: 1.0
                });
                
                const burst = new THREE.Mesh(burstGeometry, burstMaterial);
                const angle = (Math.PI * 2 * i) / 12;
                burst.position.set(vector.x, vector.y, vector.z);
                
                this.scene.add(burst);
                
                const velocity = new THREE.Vector3(
                    Math.cos(angle) * 0.08,
                    Math.sin(angle) * 0.08,
                    (Math.random() - 0.5) * 0.04
                );
                
                let opacity = 1.0;
                const animate = () => {
                    burst.position.add(velocity);
                    velocity.multiplyScalar(0.95);
                    opacity -= 0.05;
                    burst.material.opacity = Math.max(0, opacity);
                    
                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        this.scene.remove(burst);
                        burst.geometry.dispose();
                        burst.material.dispose();
                    }
                };
                animate();
            }
        });
    }
    
    // Cleanup
    dispose() {
        this.particles.forEach(p => {
            this.scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        });
        this.particles = [];
        this.flameGeometry.dispose();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FireParticleSystem;
}