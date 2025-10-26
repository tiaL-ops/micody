// "rasoa" move – a stylish spin around once
export default function rasoa(character) {
    const start = performance.now();
    const duration = 2500; // 2.5 seconds
    const parts = character.userData.parts;
    let raf;
  
    function animate() {
      const t = (performance.now() - start) / duration;
      const p = Math.min(1, t);
  
      // Spin the whole character
      character.rotation.y = p * Math.PI * 2;
  
      // Lean slightly while spinning
      character.rotation.z = Math.sin(p * Math.PI * 2) * 0.1;
  
      // Arms out during spin
      if (parts) {
        parts.leftUpper.rotation.x = -Math.PI / 2;
        parts.rightUpper.rotation.x = -Math.PI / 2;
      }
  
      // Add a little bounce
      character.position.y = Math.sin(p * Math.PI * 4) * 0.05;
  
      if (p < 1) raf = requestAnimationFrame(animate);
      else {
        // Reset orientation at end
        character.rotation.set(0, 0, 0);
        character.position.y = 0;
      }
    }
  
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf); // cleanup if interrupted
  }
  