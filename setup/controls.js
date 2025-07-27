import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

export function setupControls(camera, domElement) {
    const controls = new PointerLockControls(camera, domElement);
    document.body.addEventListener('click', () => {
        controls.lock();
    });
    return controls;
}
