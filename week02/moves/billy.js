// Arms swing move - "billy"
export default function billy(character) {
    const parts = character.userData.parts; 
    const start = performance.now();
    const duration = 2000;
    let raf;
    
    // 90 degrees amplitude for the arm swing
    const amplitude = Math.PI / 2;

    function animate() {
        const t = (performance.now() - start) / duration;
        const p = Math.min(1, t);
        // Loop to continue the movement indefinitely for the duration
        const loopTime = t * Math.PI * 2;
        character.position.y = 0.9

        // Arms swinging opposite each other
        parts.rightUpper.rotation.x = Math.sin(loopTime) * amplitude;
        parts.leftUpper.rotation.x = Math.sin(loopTime + Math.PI) * amplitude;

        if (p < 1) {
            raf = requestAnimationFrame(animate);
        } else {
            // Reset positions at the end
            parts.rightUpper.rotation.x = 0;
            parts.leftUpper.rotation.x = 0;
            character.position.y = 0.9
        }
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf); 
}