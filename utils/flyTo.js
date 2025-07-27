import * as THREE from 'three';

export function flyTo(drone, pointA, pointB, duration = 5) {

    const startPosition = pointA instanceof THREE.Vector3 ? pointA : pointA.position.clone();
    const endPosition = pointB instanceof THREE.Vector3 ? pointB : pointB.position.clone();

    const startTime = Date.now();

    const initialRotation = drone.rotation.clone();

    return new Promise((resolve) => {

        const animateFlight = () => {
            const elapsedTime = (Date.now() - startTime) / 1000; 

            if (elapsedTime < duration) {

                const t = elapsedTime / duration; 
                drone.position.lerpVectors(startPosition, endPosition, t);

                const direction = new THREE.Vector3().subVectors(endPosition, startPosition).normalize();

                const targetRotation = Math.atan2(direction.z, direction.x); 

                const rotationOffset = initialRotation.y; 
                drone.rotation.y = targetRotation + rotationOffset;

                requestAnimationFrame(animateFlight);
            } else {

                drone.position.copy(endPosition);
                const finalDirection = new THREE.Vector3().subVectors(endPosition, startPosition).normalize();
                const finalRotation = Math.atan2(finalDirection.z, finalDirection.x);
                drone.rotation.y = finalRotation + initialRotation.y; 

                console.log('Dron dotarł do punktu B!');
                resolve(); 
            }
        };

        animateFlight();
    });
}