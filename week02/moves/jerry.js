// Libérer la piste, Michael jackson est dans la place 🕺
// The antigravity movement of michael jackson

export default function jerry(character) {
  const start = performance.now();
  const duration = 2500;
  let raf;

  function animate() {
    const t = (performance.now() - start) / duration;
    const p = Math.min(1, t);

    // Tilt forward and then return
    let leanProgress;
    if (p < 0.5) {
      // Lean forward
      leanProgress = 2 * p;
      character.rotation.x = Math.PI / 4 * (leanProgress * leanProgress * leanProgress); // Lean up to 45 degrees forward
    } else {
      // Return to upright position
      leanProgress = 2 * (p - 0.5);
      character.rotation.x = Math.PI / 4 * (1 - (leanProgress * leanProgress * leanProgress)); // Return from lean
    }

    if (p < 1) {
      raf = requestAnimationFrame(animate);
    } else {
      character.rotation.x = 0;
    }
  }

  raf = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(raf);
}
