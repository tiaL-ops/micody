// all basic to import
import * as THREE from 'three';
// Import new tools for post-processing
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30; 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ReinhardToneMapping; 
document.body.appendChild( renderer.domElement );


scene.background = new THREE.Color(0x050515);


const flowers = [];

// --- Raycaster better for mouse click!!---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// --- Un peu de glow  ---
const renderScene = new RenderPass( scene, camera );
const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0;
bloomPass.strength = 0.2;
bloomPass.radius = 0.5;

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );


// --- Main animation loop ---
function animate() {
    
    flowers.forEach(flower => {
        flower.rotation.y += 0.01;
        
        if (flower.scale.x < 1) {
            const scale = flower.scale.x + 0.02;
            flower.scale.set(scale, scale, scale);
        }
    });

  
  composer.render();
}
renderer.setAnimationLoop( animate );



document.addEventListener('click', function(event) {
   
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    
    raycaster.setFromCamera( mouse, camera );
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); 
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);
    

    createFlower(intersectPoint);
});

// --- create  flower  here :) ---
function createFlower(position) {
    const flower = new THREE.Group();
    
    // Create some petals stuff
    const petalGeometry = new THREE.SphereGeometry(2, 16, 16);
    const petalMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(Math.random(), Math.random(), Math.random())
    });

    for (let i = 0; i < 6; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (i / 6) * Math.PI * 2;
        petal.position.x = Math.cos(angle) * 3;
        petal.position.y = Math.sin(angle) * 3;
        flower.add(petal);
    }
    
    // where you want the pflower to appear
    flower.position.copy(position);
    flower.scale.set(0, 0, 0); 
    
    scene.add(flower);
    flowers.push(flower); 
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});