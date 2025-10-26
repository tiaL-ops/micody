const baseY = 0.9;
const leftInitialZ = Math.PI / 8;
const rightInitialZ = -Math.PI / 8;
const leftOpenZ = Math.PI / 2;
const rightOpenZ = -Math.PI / 2;

export default function rayane(character) {
	const start = performance.now();
	const parts = character.userData.parts;
	const duration = 2500;
	let handle = -1;

	function animate(now) {
		const t = (now - start) / duration;
		const p = Math.max(0, Math.min(1, t));

		moveCamera(t);
		const lift = jump(character, p);
		moveArms(parts, lift);

		if (p < 1) handle = requestAnimationFrame(animate);
		else reset(character);
	}

	handle = requestAnimationFrame(animate);
	return () => cancelAnimationFrame(handle);
}

function moveCamera(t) {
	const self = window.dance;
	const a = 0.4;
	// camera z shift: forward then back
	const step = t < 0.4 ? t / a : t < 0.8 ? 1 - (t - a) / a : 0;
	self.camera.position.z = self.camera.position.z + 5 * step;
	self.camera.updateProjectionMatrix();
	self.renderer.render(self.scene, self.camera);
}

function jump(character, p) {
	const amplitude = 2.0;
	const lift = Math.sin(p * Math.PI);
	character.rotation.x = Math.PI * 2 * p;
	// vertical arc and slight forward/back z shift
	character.position.y = baseY + lift * amplitude;
	character.position.z = -Math.sin(p * Math.PI) * (amplitude / 2);
	return lift;
}

function moveArms(parts, lift) {
	// arms open, then close on landing
	const openFactor = lift;

	if (parts) {
		parts.leftUpper.rotation.z =
			leftInitialZ + (leftOpenZ - leftInitialZ) * openFactor;
		parts.rightUpper.rotation.z =
			rightInitialZ + (rightOpenZ - rightInitialZ) * openFactor;
		parts.leftUpper.rotation.x = -0.2 * openFactor;
		parts.rightUpper.rotation.x = -0.2 * openFactor;
	}
}

function reset(character) {
	const parts = character.userData.parts;
	character.rotation.set(0, 0, 0);
	character.position.set(0, baseY, 0);
	if (parts) {
		parts.leftUpper.rotation.z = leftInitialZ;
		parts.rightUpper.rotation.z = rightInitialZ;
		parts.leftUpper.rotation.x = 0;
		parts.rightUpper.rotation.x = 0;
	}
}
