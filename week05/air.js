// Air particle system
class AirParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
        this.maxParticles = 100;
        
        // Air geometries - rings and spirals
        this.ringGeometry = new THREE.TorusGeometry(0.08, 0.02, 8, 16);
        this.sphereGeometry = new THREE.SphereGeometry(0.04, 8, 8);
    }
    
    // Spawn air swirls at hand position
    spawnAirSwirls(screenX, screenY, camera) {
        // FLIP the X coordinate
        const flippedX = window.innerWidth - screenX;
        
        const ndcX = (flippedX / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        
        // Spawn 2-3 particles per frame
        for (let i = 0; i < 2; i++) {
            if (this.particles.length >= this.maxParticles) {
                const old = this.particles.shift();
                this.scene.remove(old.mesh);
                old.mesh.geometry.dispose();
                old.mesh.material.dispose();
            }
            
            // Randomly use rings or spheres
            const useRing = Math.random() > 0.4;
            const geometry = useRing ? this.ringGeometry.clone() : this.sphereGeometry.clone();
            
            const material = new THREE.MeshPhongMaterial({
                color: 0xccffff,
                transparent: true,
                opacity: 0.6,
                emissive: 0x88ddff,
                shininess: 100
            });
            
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.set(
                vector.x + (Math.random() - 0.5) * 0.25,
                vector.y + (Math.random() - 0.5) * 0.2,
                vector.z
            );
            
            // Spiral movement
            const angle = Math.random() * Math.PI * 2;
            const radius = 0.3;
            
            const data = {
                mesh: particle,
                velocity: new THREE.Vector3(
                    Math.cos(angle) * 0.03,
                    (Math.random() - 0.5) * 0.02,
                    Math.sin(angle) * 0.03
                ),
                rotation: {
                    x: (Math.random() - 0.5) * 0.3,
                    y: (Math.random() - 0.5) * 0.3,
                    z: (Math.random() - 0.5) * 0.3
                },
                life: 1.0,
                age: 0,
                spiralAngle: angle,
                spiralSpeed: 0.05 + Math.random() * 0.05
            };
            
            this.scene.add(particle);
            this.particles.push(data);
        }
    }
    
    // Update all particles
    update() {
        this.particles = this.particles.filter(p => {
            // Spiral motion
            p.spiralAngle += p.spiralSpeed;
            const spiralRadius = 0.2 * (1.0 - p.life);
            p.velocity.x = Math.cos(p.spiralAngle) * 0.03;
            p.velocity.z = Math.sin(p.spiralAngle) * 0.03;
            
            // Update position
            p.mesh.position.add(p.velocity);
            
            // Rotation
            p.mesh.rotation.x += p.rotation.x;
            p.mesh.rotation.y += p.rotation.y;
            p.mesh.rotation.z += p.rotation.z;
            
            // Age and fade
            p.age += 0.016;
            p.life = 1.0 - (p.age / 2.0);  // 2 second lifespan
            
            // Fade and expand
            p.mesh.material.opacity = Math.max(0, p.life * 0.6);
            const scale = 1.0 + (1.0 - p.life) * 1.5;
            p.mesh.scale.set(scale, scale, scale);
            
            // Remove if dead
            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                return false;
            }
            
            return true;
        });
    }
    
    // Create wind gust effect
    createWindGust(screenX, screenY, camera) {
        const flippedX = window.innerWidth - screenX;
        const ndcX = (flippedX / window.innerWidth) * 2 - 1;
        const ndcY = -(screenY / window.innerHeight) * 2 + 1;
        
        const vector = new THREE.Vector3(ndcX, ndcY, 0.5);
        vector.unproject(camera);
        
        // Create wind lines
        for (let i = 0; i < 15; i++) {
            const lineGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.3, 6);
            const lineMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.7
            });
            
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.set(
                vector.x + (Math.random() - 0.5) * 0.5,
                vector.y + (Math.random() - 0.5) * 0.3,
                vector.z
            );
            
            const angle = Math.random() * Math.PI * 2;
            line.rotation.z = angle;
            
            this.scene.add(line);
            
            const velocity = new THREE.Vector3(
                Math.cos(angle) * 0.1,
                Math.sin(angle) * 0.1,
                0
            );
            
            let opacity = 0.7;
            const animate = () => {
                line.position.add(velocity);
                opacity -= 0.05;
                line.material.opacity = Math.max(0, opacity);
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    this.scene.remove(line);
                    line.geometry.dispose();
                    line.material.dispose();
                }
            };
            animate();
        }
    }
    
    // Cleanup
    dispose() {
        this.particles.forEach(p => {
            this.scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
        });
        this.particles = [];
        this.ringGeometry.dispose();
        this.sphereGeometry.dispose();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AirParticleSystem;
}