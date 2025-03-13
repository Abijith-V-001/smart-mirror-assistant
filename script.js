// Load Three.js from a CDN
const THREE = window.THREE;

// Scene and Camera Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("avatar-container").appendChild(renderer.domElement);

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(2, 4, 5);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Variables for Avatar and Parts
let avatar, mouthMesh, leftHand, rightHand;
//let originalLeftHandRot, originalRightHandRot; // Store original hand rotation

// Load GLTF Model
const loader = new THREE.GLTFLoader();
loader.load(
    "assets/avatar.glb",
    function (gltf) {
        avatar = gltf.scene;
        avatar.position.set(0, -0.5, 0);
        avatar.scale.set(1.2, 1.2, 1.2);
        scene.add(avatar);

        console.log("✅ Avatar Loaded Successfully");

        // Find Mesh with Shape Keys
        avatar.traverse((child) => {
            if (child.isMesh && child.name.includes("Wolf3D_Head")) {
                mouthMesh = child;
                console.log("✅ Correct Mouth Mesh Selected:", child.name);
            }
        });

        // Find Hands (Change names if needed)
        leftHand = avatar.getObjectByName("LeftHand");// || avatar.getObjectByName("Hand_L");
        rightHand = avatar.getObjectByName("RightHand");// || avatar.getObjectByName("Hand_R");

        console.log("Left Hand:", leftHand);
        console.log("Right Hand:", rightHand);
    },
    undefined,
    function (error) {
        console.error("❌ Error loading GLB file:", error);
    }
);

// Adjust Camera Position
camera.position.set(0, 1.5, 1.5);  // Raise camera to eye level
//camera.lookAt(avatar.position);    // Make camera look at the avatar


// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to Control Shape Keys for Lip Sync
let lipSyncInterval;
function animateLips(isSpeaking) {
    if (!mouthMesh) return;

    if (isSpeaking) {
        lipSyncInterval = setInterval(() => {
            const strength = Math.random() * 0.8 + 0.2;
            mouthMesh.morphTargetInfluences[mouthMesh.morphTargetDictionary["mouthOpen"]] = strength;
        }, 150);
    } else {
        clearInterval(lipSyncInterval);
        mouthMesh.morphTargetInfluences[mouthMesh.morphTargetDictionary["mouthOpen"]] = 0;
    }
}

// Hand Gesture Animation
let handAnimationInterval;
function animateHands() {
    if (leftHand) {
        gsap.to(leftHand.rotation, { z: 0.3, duration: 0.2, yoyo: true, repeat: 1 });
    } else {
        console.warn("⚠️ Left Hand not found!");
    }


    if (rightHand) {
        gsap.to(rightHand.rotation, { z: -0.3, duration: 0.2, yoyo: true, repeat: 1 });
    } else {
        console.warn("⚠️ Right Hand not found!");
    }
}

// Start Animations when Speaking
function startSpeakingAnimation() {
    animateLips(true);
    animateHands(true);
}

// Stop Animations
function stopSpeakingAnimation() {
    animateLips(false);
    animateHands(false);
}

// Export functions for assistant.js
window.startSpeakingAnimation = startSpeakingAnimation;
window.stopSpeakingAnimation = stopSpeakingAnimation;
