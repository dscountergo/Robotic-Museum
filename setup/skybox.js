import * as THREE from 'three';

export function loadSkybox(scene) {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        '/textures/skybox/right.jpg',
        '/textures/skybox/left.jpg',
        '/textures/skybox/up.jpg',
        '/textures/skybox/down.jpg',
        '/textures/skybox/forward.jpg',
        '/textures/skybox/back.jpg',
    ]);
    scene.background = texture;
}
