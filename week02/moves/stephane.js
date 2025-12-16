// Helloo ducoup moi ca va en haut et en bas haa
// This move is a simple jump and land animation
export default function stephane(character) {
  const parts = character.userData.parts; 
  const start = performance.now();
  const duration = 3000; // total move time (ms)
  let raf;

  function animate() {
    const t = (performance.now() - start) / duration;
    const p = Math.min(1, t);

    // Character spins around Y axis
    character.rotation.y = p * Math.PI * 2; // Full 360 degree spin

    // Body bobs up and down slightly during spin
    character.position.y = 0.9 + Math.sin(p * Math.PI * 4) * 0.15;

    // Arms wave in opposite directions (windmill effect)
    parts.leftUpper.rotation.x = Math.sin(p * Math.PI * 4) * 0.8;
    parts.rightUpper.rotation.x = -Math.sin(p * Math.PI * 4) * 0.8;
    
    // Arms also rotate outward during spin
    parts.leftUpper.rotation.z = Math.sin(p * Math.PI * 2) * 0.5;
    parts.rightUpper.rotation.z = -Math.sin(p * Math.PI * 2) * 0.5;

    // Legs spread slightly during spin
    parts.leftUpperLeg.rotation.x = Math.sin(p * Math.PI * 2) * 0.3;
    parts.rightUpperLeg.rotation.x = -Math.sin(p * Math.PI * 2) * 0.3;

    if (p < 1) raf = requestAnimationFrame(animate);
    else {
      // Reset all positions at end
      character.rotation.y = 0;
      character.position.y = 0.9;
      parts.leftUpper.rotation.x = 0;
      parts.rightUpper.rotation.x = 0;
      parts.leftUpper.rotation.z = 0;
      parts.rightUpper.rotation.z = 0;
      parts.leftUpperLeg.rotation.x = 0;
      parts.rightUpperLeg.rotation.x = 0;
    }
  }

  raf = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(raf); // optional cleanup
}

  