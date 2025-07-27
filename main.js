import * as THREE from 'three';  
import { createCamera } from './setup/camera.js';
import { setupControls } from './setup/controls.js';
import { createAmbientLight } from './setup/lights.js';
import { loadSkybox } from './setup/skybox.js';
import { setupKeyboardListeners } from './utils/keyboard.js';
import { loadMultipleModels } from './setup/loader.js';
import { AnimationController } from './utils/animationController.js';
import { EventManager } from './utils/eventManager.js';

const scene = new THREE.Scene();
const camera = createCamera();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Włączenie cieni w rendererze
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Wybór typu cieni

document.body.appendChild(renderer.domElement);

const sceneObjectMap = new Map();
const mixers = []; 
const animationController = new AnimationController();

const eventManager = new EventManager(camera, scene, animationController);

const controls = setupControls(camera, renderer.domElement);
const ambientLight = createAmbientLight();
ambientLight.name = 'ambientLight'; // Dodanie nazwy
scene.add(ambientLight);

loadSkybox(scene);

document.addEventListener('keydown', (event) => {
    if (event.key.toLowerCase() === 'e') {
        toggleInstructionImage();
    }
});

let isInstructionImageDefault = true; 

function toggleInstructionImage() {
    const instructionImage = document.getElementById('instruction-image');

    if (isInstructionImageDefault) {

        instructionImage.src = 'public/images/E.png';  
        instructionImage.style.width = 'auto';  
        instructionImage.style.height = '50px'; 
    } else {

        instructionImage.src = 'public/images/controls.png';  
        instructionImage.style.width = 'auto';  
        instructionImage.style.height = '175px'; 
    }

    isInstructionImageDefault = !isInstructionImageDefault;
}

const modelsToLoad = [
    { path: 'public/models/scene.glb', name: 'Scena_Root', delay: 6000 },
    { path: 'public/models/Doors.glb', name: 'doors', relativeTo: 'drzwi', offset: new THREE.Vector3(-0.25, -1.7, 0), delay: 6000 },
    { path: 'public/models/Traitor.glb', name: 'traitor', relativeTo: 'zdrada', offset: new THREE.Vector3(0, 0.175, 0), delay: 1000 },
    { path: 'public/models/Stress.glb', name: 'Stress', relativeTo: 'czlowiek', offset: new THREE.Vector3(0, 0, 0), delay: 1000 },
    { path: 'public/models/Prison.glb', name: 'Prison', relativeTo: 'wiezien', offset: new THREE.Vector3(0, 0.175, 0), delay: 1000 },
    { path: 'public/models/Apollo.glb', name: 'Space_Mission', relativeTo: 'apollo', offset: new THREE.Vector3(0, 0.175, 0), delay: 1000 },
    { path: 'public/models/Drone.glb', name: 'Drone', relativeTo: 'dron', offset: new THREE.Vector3(6, 0, 0), delay: 1000 },
];

const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

async function initializeScene() {

    await loadMultipleModels(modelsToLoad, scene, sceneObjectMap, mixers, (modelName, mixer, animations, index) => {
        animationController.addModel(modelName, mixer, animations);

        setTimeout(() => {                     /// WSTEPNE USTAWIANIE ANIMACJI PO ZAŁADOWANIU
            if (modelName === 'doors') {
                animationController.play('doors', 'Take 001', THREE.LoopRepeat, 0);
            }
            if (modelName === 'traitor') {
                animationController.play('traitor', 'ATTACK', THREE.LoopRepeat, Infinity);
            }
            if (modelName === 'Drone') {
                animationController.play('Drone', 'DEFAULT', THREE.LoopRepeat, Infinity);
                const object = sceneObjectMap.get('Drone');
                object.rotation.z = degreesToRadians(10);
                object.castShadow = true; 
            }
        }, 0); 
    });

    console.log("Wszystkie modele zostały załadowane i animacje rozpoczęte!");
}

initializeScene().then(() => {
    let isMoving = {};
    setupKeyboardListeners(isMoving);

    let velocity = new THREE.Vector3();
    let direction = new THREE.Vector3();
    const baseSpeed = 5;
    const sprintMultiplier = 2; 
    let clock = new THREE.Clock();

    hideLoadingScreen();
    const instructionImage = document.getElementById('instruction-image');
    instructionImage.style.display = 'block';  

    function animate() {
        const delta = clock.getDelta();

        animationController.update(delta);

        eventManager.update(); 

        const speed = isMoving['shift'] ? baseSpeed * sprintMultiplier : baseSpeed;
        const moveDistance = speed * delta;

        controls.update();

        let forward = new THREE.Vector3(0, 0, -1);
        let right = new THREE.Vector3(1, 0, 0);

        forward.applyQuaternion(camera.quaternion);
        right.applyQuaternion(camera.quaternion);

        forward.y = 0;
        right.y = 0;

        direction.set(0, 0, 0);

        if (isMoving['w']) direction.add(forward); 
        if (isMoving['s']) direction.sub(forward); 
        if (isMoving['a']) direction.sub(right);   
        if (isMoving['d']) direction.add(right);   

        direction.normalize();

        velocity.x = direction.x * moveDistance;
        velocity.y = 0;
        velocity.z = direction.z * moveDistance;

        camera.position.add(velocity);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
});
