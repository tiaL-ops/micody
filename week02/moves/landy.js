// Helloo ducoup moi ca va en haut et en bas haa
// This move is a simple jump and land animation
export default function landy(character) {
    const parts = character.userData.parts; 
    const start = performance.now();
    const duration = 800; // total move time (ms)
    let raf;
  
    function animate() {
      const t = (performance.now() - start) / duration;
      const p = Math.min(1, t);
  
      // Jump up, then land down (using sine curve)
      character.position.y = Math.sin(p * Math.PI) * 0.4;
  
      // Arms swing during jump
      parts.leftUpper.rotation.x = -Math.sin(p * Math.PI) * 0.6;
      parts.rightUpper.rotation.x = -Math.sin(p * Math.PI) * 0.6;
  
      // Knees bend slightly on landing
      parts.leftUpperLeg.rotation.x = -0.2 * Math.sin(p * Math.PI);
      parts.rightUpperLeg.rotation.x = -0.2 * Math.sin(p * Math.PI);
  
      if (p < 1) raf = requestAnimationFrame(animate);
      else character.position.y = 0; // reset at end
    }
  
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf); // optional cleanup
  }
  