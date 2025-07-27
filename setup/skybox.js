import * as THREE from 'three';

export function loadSkybox(scene) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        'public/textures/skybox/right.jpg',
        'public/textures/skybox/left.jpg',
        'public/textures/skybox/up.jpg',
        'public/textures/skybox/down.jpg',
        'public/textures/skybox/forward.jpg',
        'public/textures/skybox/back.jpg',
    ]);
    scene.background = texture;
}
