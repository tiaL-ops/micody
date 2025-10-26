// un salto arrière à la pompom girls
//(flm de rendre ça beau)

export default function oelan(character) {
  const start = performance.now();
  const duration = 1500;
  const parts = character.userData.parts;
  let raf;

  // so that it remains smooth
  function ease(t) { return t<0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }

  function animate() {
    const t = Math.min(1, (performance.now()-start)/duration);
    const p = ease(t);

    // rotation et position du corps
    character.rotation.x = -Math.PI*2*p;
    character.position.y = 0.3*Math.sin(p*Math.PI);

    // en esperant que je retombe sur mes deux jambes
    if (parts) {
      // bras
      const arm = Math.sin(p*Math.PI*4)*0.2;
      parts.leftUpper.rotation.z = arm;
      parts.rightUpper.rotation.z = -arm;
      // jambes
      const leg = Math.sin(p*Math.PI)*0.5;
      parts.leftLower.rotation.x = leg;
      parts.rightLower.rotation.x = leg;
    }

    if (t<1) raf = requestAnimationFrame(animate);
    else { character.rotation.set(0,0,0); character.position.y=0; }
  }
  // hop lààà
  raf = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(raf);
}
