import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export function loadModel(path, scene, objectMap, onLoadCallback) {
    const loader = new GLTFLoader();

    loader.load(
        path,
        (gltf) => {
            console.group(`Załadowano model: ${path}`);

            console.log(`Główny element sceny: ${gltf.scene.name || "(główny model)"}`);

            gltf.scene.traverse((object) => {
                if (object.type === 'Object3D' && object.name) {
                    console.log(`Znaleziono obiekt: ${object.name}`);
                }

                if (object.name) {
                    objectMap.set(object.name, object);
                }
            });

            let mixer = null;
            if (gltf.animations && gltf.animations.length > 0) {
                console.log(`Model zawiera ${gltf.animations.length} animacje.`);

                mixer = new THREE.AnimationMixer(gltf.scene);

                gltf.animations.forEach((clip, index) => {
                    console.group(`Animacja ${index + 1}`);
                    console.log(`Nazwa: ${clip.name}`);
                    console.log(`Czas trwania: ${clip.duration.toFixed(2)} sekund`);
                    console.log(`Ścieżki: ${clip.tracks.length} ścieżek`);
                    console.groupEnd();

                    const action = mixer.clipAction(clip);
                });
            } else {
                console.log("Model nie zawiera animacji.");
            }

            console.groupEnd();

            if (onLoadCallback) {
                onLoadCallback(gltf.scene, mixer, gltf.animations);
            }
        },
        undefined,
        (error) => {
            console.error(`Błąd podczas ładowania modelu z ścieżki: ${path}`, error);
        }
    );
}

export function loadMultipleModels(models, scene, objectMap, mixers, onLoadCallback) {
    return new Promise((resolve) => {
        let modelsLoadedCount = 0;

        models.forEach((model, index) => {
            loadModel(model.path, scene, objectMap, (gltfScene, mixer, animations) => {
                if (mixer) mixers.push(mixer);

                if (model.name && gltfScene) {
                    gltfScene.name = model.name;
                    objectMap.set(model.name, gltfScene);
                }

                setTimeout(() => {
                    if (animations && animations.length > 0) {
                        animations.forEach((clip) => {
                            const action = mixer.clipAction(clip);
                            action.play();
                        });
                    }

                    if (model.relativeTo && model.offset) {
                        const relativeObject = objectMap.get(model.relativeTo);
                        if (relativeObject) {
                            gltfScene.position.copy(relativeObject.position);
                            gltfScene.position.add(model.offset);
                        }
                    }

                    scene.add(gltfScene);

                    modelsLoadedCount++;
                    if (modelsLoadedCount === models.length) {
                        resolve();  
                    }

                    if (onLoadCallback) {
                        onLoadCallback(model.name, mixer, animations, index);
                    }
                }, 3000);
            });
        });
    });
}