import * as THREE from 'three';

let spotlight = null; 
let originalAmbientIntensity = null; 

export function createAmbientLight() {
    return new THREE.AmbientLight(0xffffff, 2); 
}

export function turnOnSpotlight(scene, targetObject) {
    if (!targetObject) {
        console.warn('Nie znaleziono obiektu docelowego dla spotlight!');
        return;
    }

    if (spotlight) {
        scene.remove(spotlight);
    }

    spotlight = new THREE.SpotLight(0xffffff, 200, 1000, Math.PI / 7); 

    spotlight.castShadow = true;

    spotlight.position.set(
        targetObject.position.x,
        targetObject.position.y + 10, 
        targetObject.position.z
    );

    spotlight.target = targetObject;

    spotlight.penumbra = 0.1; 
    spotlight.distance = 100; 

    scene.add(spotlight);

    const ambientLight = scene.getObjectByName('ambientLight');
    if (ambientLight) {
        originalAmbientIntensity = ambientLight.intensity;
        ambientLight.intensity = 0.5; 
    }
}

export function turnOffSpotlight(scene) {
    if (spotlight) {
        scene.remove(spotlight);
        spotlight = null;
    }

    const ambientLight = scene.getObjectByName('ambientLight');
    if (ambientLight && originalAmbientIntensity !== null) {
        ambientLight.intensity = originalAmbientIntensity;
        originalAmbientIntensity = null;
    }
}