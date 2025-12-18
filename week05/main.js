const webcamCanvas = document.getElementById('webcamCanvas');
const ctx = webcamCanvas.getContext('2d');
const threeCanvas = document.getElementById('threeCanvas');
const startWebcamBtn = document.getElementById('startWebcam');
const info = document.getElementById('info');

let detector;
let video = null;
let webcamRunning = false;

// Three.js setup
let scene, camera, renderer;
let waterSystem;
let earthSystem;
let fireSystem;
let airSystem;

const connections = [
    [0, 1], [0, 2], [1, 3], [2, 4], //head
    [5, 6], [5, 7], [7, 9], [6, 8], [8, 10], //arms
    [5, 11], [6, 12], [11, 12], //torso
    [11, 13], [13, 15], [12, 14], [14, 16] //legs
];

// Initialize Three.js
function initThree() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: threeCanvas, 
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);
    
    // Initialize water system
    waterSystem = new WaterParticleSystem(scene);
    earthSystem = new EarthParticleSystem(scene);
    fireSystem = new FireParticleSystem(scene);
airSystem = new AirParticleSystem(scene);
}

// Three.js animation loop
function animate3D() {
    requestAnimationFrame(animate3D);
    waterSystem.update();
    earthSystem.update();
    fireSystem.update();
airSystem.update();
    renderer.render(scene, camera);
}

// Initialize detector
async function init() {
    await tf.ready();
    detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
    );
    startWebcamBtn.disabled = false;
    initThree();
    animate3D();
}

// Check if right hand is raised (wrist above shoulder) - WATER 💧
function isRightHandRaised(keypoints) {
    const rightWrist = keypoints[10];
    const rightShoulder = keypoints[6];
    
    if (rightWrist.score > 0.3 && rightShoulder.score > 0.3) {
        return rightWrist.y < rightShoulder.y;
    }
    return false;
}

// Check if left hand is raised (wrist above shoulder) - EARTH 🪨
function isLeftHandRaised(keypoints) {
    const leftWrist = keypoints[9];
    const leftShoulder = keypoints[5];
    
    if (leftWrist.score > 0.3 && leftShoulder.score > 0.3) {
        return leftWrist.y < leftShoulder.y;
    }
    return false;
}

// Check if both hands are in middle torso, above hips, and spread apart - FIRE 🔥
function areBothHandsInMiddleApart(keypoints) {
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    
    if (leftWrist.score > 0.3 && rightWrist.score > 0.3 &&
        leftHip.score > 0.3 && rightHip.score > 0.3 &&
        leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
        
        // Calculate mid-torso Y position (between shoulders and hips)
        const midTorsoY = (leftShoulder.y + rightShoulder.y + leftHip.y + rightHip.y) / 4;
        const torsoHeight = ((leftHip.y + rightHip.y) / 2) - ((leftShoulder.y + rightShoulder.y) / 2);
        
        // Both wrists should be near mid-torso height (within 40% of torso height from midpoint)
        const leftWristNearMidTorso = Math.abs(leftWrist.y - midTorsoY) < torsoHeight * 0.4;
        const rightWristNearMidTorso = Math.abs(rightWrist.y - midTorsoY) < torsoHeight * 0.4;
        
        // Hands should be spread apart (distance between wrists > 60% of shoulder width)
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        const wristDistance = Math.abs(rightWrist.x - leftWrist.x);
        const handsSpreadApart = wristDistance > shoulderWidth * 0.6;
        
        return leftWristNearMidTorso && rightWristNearMidTorso && handsSpreadApart;
    }
    return false;
}

// Check if both hands are in middle torso, above hips, and together - AIR 💨
function areBothHandsInMiddleTogether(keypoints) {
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];
    const leftHip = keypoints[11];
    const rightHip = keypoints[12];
    const leftShoulder = keypoints[5];
    const rightShoulder = keypoints[6];
    
    if (leftWrist.score > 0.3 && rightWrist.score > 0.3 &&
        leftHip.score > 0.3 && rightHip.score > 0.3 &&
        leftShoulder.score > 0.3 && rightShoulder.score > 0.3) {
        
        const handsAboveHips = leftWrist.y < leftHip.y && rightWrist.y < rightHip.y;
        const handsBelowShoulders = leftWrist.y > leftShoulder.y && rightWrist.y > rightShoulder.y;
        
        const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);
        const wristDistance = Math.abs(rightWrist.x - leftWrist.x);
        const handsTogether = wristDistance < shoulderWidth * 0.3;
        
        return handsAboveHips && handsBelowShoulders && handsTogether;
    }
    return false;
}

// Draw skeleton
function drawSkeleton(keypoints) {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    connections.forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];
        
        if (kp1.score > 0.3 && kp2.score > 0.3) {
            ctx.beginPath();
            ctx.moveTo(kp1.x, kp1.y);
            ctx.lineTo(kp2.x, kp2.y);
            ctx.stroke();
        }
    });

    keypoints.forEach(kp => {
        if (kp.score > 0.3) {
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

// Draw emojis
function drawFireEmoji(x, y) {
    ctx.font = '60px Arial';
    ctx.fillText('🔥', x - 30, y + 20);
}

function drawAirEmoji(x, y) {
    ctx.font = '60px Arial';
    ctx.fillText('💨', x - 30, y + 20);
}

function drawEarthEmoji(x, y) {
    ctx.font = '60px Arial';
    ctx.fillText('🪨', x - 30, y + 20);
}

// Webcam loop
async function webcamLoop() {
    if (!webcamRunning) return;

    ctx.drawImage(video, 0, 0, webcamCanvas.width, webcamCanvas.height);

    const detected = await detector.estimatePoses(webcamCanvas);

    if (detected && detected.length > 0) {
        const keypoints = detected[0].keypoints;
        
        drawSkeleton(keypoints);

       if (areBothHandsInMiddleTogether(keypoints)) {
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];
    const midX = (leftWrist.x + rightWrist.x) / 2;
    const midY = (leftWrist.y + rightWrist.y) / 2;
    
    airSystem.spawnAirSwirls(midX, midY, camera);
    
    if (Math.random() > 0.98) {
        airSystem.createWindGust(midX, midY, camera);
    }
    
    info.textContent = "💨 AIr!";
            
       } else if (areBothHandsInMiddleApart(keypoints)) {
    const leftWrist = keypoints[9];
    const rightWrist = keypoints[10];
    
    fireSystem.spawnFlames(leftWrist.x, leftWrist.y, rightWrist.x, rightWrist.y, camera);
    
    if (Math.random() > 0.97) {
        fireSystem.createFireBurst(leftWrist.x, leftWrist.y, rightWrist.x, rightWrist.y, camera);
    }
    
    info.textContent = "🔥 !";
            
        } else if (isRightHandRaised(keypoints)) {
            const rightWrist = keypoints[10];
            if (rightWrist.score > 0.3) {
                waterSystem.spawnDroplets(rightWrist.x, rightWrist.y, camera);
                
                if (Math.random() > 0.95) {
                    waterSystem.createSplash(rightWrist.x, rightWrist.y, camera);
                }
                
                info.textContent = "wateer";
            }
            
       } else if (isLeftHandRaised(keypoints)) {
    const leftWrist = keypoints[9];
    if (leftWrist.score > 0.3) {
        earthSystem.spawnRocks(leftWrist.x, leftWrist.y, camera);
        
        // Occasional dust cloud effect
        if (Math.random() > 0.97) {
            earthSystem.createDustCloud(leftWrist.x, leftWrist.y, camera);
        }
        
        info.textContent = "earth!";
    }

            
        } else {
            info.textContent = "Try: Right hand = 💧 Water | Left hand = 🪨 Earth | Both spread = 🔥 Fire | Both together = 💨 Air";
        }
    } else {
        info.textContent = "Can't see you! Step back so I can see your whole body!";
    }

    requestAnimationFrame(webcamLoop);
}

// Start/Stop webcam
startWebcamBtn.onclick = async () => {
    if (!webcamRunning) {
        try {
            video = document.createElement('video');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { width: 640, height: 480 } 
            });
            video.srcObject = stream;
            video.play();

            video.onloadeddata = () => {
                webcamCanvas.width = video.videoWidth;
                webcamCanvas.height = video.videoHeight;
                webcamRunning = true;
                startWebcamBtn.textContent = "Stop Webcam";
                webcamLoop();
            };
        } catch (error) {
            alert("Error accessing webcam: " + error.message);
        }
    } else {
        webcamRunning = false;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        startWebcamBtn.textContent = "Start Webcam";
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, webcamCanvas.width, webcamCanvas.height);
        info.textContent = "Ready to bend some elements! Start your webcam!";
    }
};

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
init();