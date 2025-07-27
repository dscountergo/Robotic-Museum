import * as THREE from 'three';
import { flyTo } from './flyTo';
import { AudioLoader } from 'three';
import { turnOnSpotlight, turnOffSpotlight } from '../setup/lights.js';


export class EventManager {
    constructor(camera, scene, animationController) {
        this.camera = camera;
        this.scene = scene;
        this.animationController = animationController;
        this.audioLoader = new AudioLoader();
        this.audioListener = new THREE.AudioListener();
        this.camera.add(this.audioListener); 
        this.events = [];
        this.eventStates = new Map();
        this.isWaitingForFlight = false;
        this.isEventInProgress = false; 
        this.initialRotations = new Map();

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        window.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('AudioContext resumed');
                });
            }
        });

        this.initializeEvents();
    }

    async playSoundAndWaitForCompletion(soundPath) {
        return new Promise((resolve, reject) => {
            const sound = new THREE.Audio(this.audioListener);

            this.audioLoader.load(soundPath, (buffer) => {
                sound.setBuffer(buffer);
                sound.setLoop(false); 
                sound.setVolume(0.6); 

                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('AudioContext resumed before playing sound');
                        sound.play();

                        const checkSoundCompletion = () => {
                            if (!sound.isPlaying) {
                                resolve();
                            } else {
                                requestAnimationFrame(checkSoundCompletion);
                            }
                        };

                        checkSoundCompletion();
                    });
                } else {
                    sound.play();

                    const checkSoundCompletion = () => {
                        if (!sound.isPlaying) {
                            resolve();
                        } else {
                            requestAnimationFrame(checkSoundCompletion);
                        }
                    };

                    checkSoundCompletion();
                }
            }, undefined, (error) => {
                reject(`Error loading sound: ${error}`);
            });
        });
    }

    initializeEvents() {
        const predefinedEvents = [
            {
                name: 'OpenDoors',
                condition: (camera, scene) => {
                    const doors = scene.getObjectByName('doors');
                    if (!doors) {
                        console.warn('Could not find "doors" object in the scene!');
                        return false;
                    }

                    const distance = camera.position.distanceTo(doors.position);
                    return distance < 4;
                },
                action: (animationController, event) => {
                    if (this.isEventInProgress) return; 

                    this.isEventInProgress = true; 
                    const doors = this.scene.getObjectByName('doors');
                    if (!doors) {
                        console.warn('Could not find "doors" object in the scene!');
                        this.isEventInProgress = false; 
                        return;
                    }

                    this.playSoundAndWaitForCompletion('../public/sounds/Doors.mp3');

                    if (event.executed % 2 === 0) {
                        animationController.stopAtEnd('doors', 'Take 001');
                        console.log('Opening doors...');

                    } else {
                        animationController.playReverse('doors', 'Take 001', THREE.LoopRepeat, 1);
                        console.log('Closing doors...');
                    }

                    this.isEventInProgress = false; 
                    if (event.executed === 0) {
                        setTimeout(() => {
                            this.triggerEvent('Welcome');
                        }, 3000); 
                    }
                },
                executed: 0,
                maxExecutions: Infinity,
                lastExecutionTime: 0,
                executionDelay: 5000,
            },
            {
                name: 'Welcome',
                condition: () => false, 
                action: async () => {
                    if (this.isEventInProgress) return; 

                    this.isEventInProgress = true; 
                    console.warn('Welcome to our world!');

                    const drone = this.scene.getObjectByName('Drone');
                    if (!drone) {
                        console.warn('Could not find "Drone" model in the scene!');
                        this.isEventInProgress = false; 
                        return;
                    }

                    await this.playSoundAndWaitForCompletion('../public/sounds/Welcome.mp3');

                    this.isEventInProgress = false; 
                },
                manualTriggerOnly: true,
                executed: 0,
                maxExecutions: 1,
                lastExecutionTime: 0,
                executionDelay: 0,
            },

            {
                name: 'GoToTraitor',
                condition: (camera, scene) => {
                    const traitor = scene.getObjectByName('traitor');
                    if (!traitor) {
                        console.warn('Could not find "traitor" object in the scene!');
                        return false;
                    }
                    const distance = camera.position.distanceTo(traitor.position);
                    return distance < 7;
                },
                action: async () => {
                    if (this.isEventInProgress) return; 

                    this.isEventInProgress = true; 
                    console.warn('Drone heading to Traitor...');

                    const drone = this.scene.getObjectByName('Drone');
                    if (!drone) {
                        this.isEventInProgress = false; 
                        return;
                    }
                    

                    const pointB = this.scene.getObjectByName('dron_zdrada');
                    const spot = this.scene.getObjectByName('traitor');;
                    await flyTo(drone, drone, pointB, 5);
                    turnOnSpotlight(this.scene, spot);
                    await this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');

                    await this.playSoundAndWaitForCompletion('../public/sounds/Traitor.mp3');
                    this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');
                    turnOffSpotlight(this.scene);


                    this.isEventInProgress = false; 
                },
                executed: 0,
                maxExecutions: 1,
                lastExecutionTime: 0,
                executionDelay: 0,
            },
            {
                name: 'GoToSpaceMission',
                condition: (camera, scene) => {
                    const spaceMission = scene.getObjectByName('Space_Mission');
                    if (!spaceMission) {
                        console.warn('Could not find "Space_Mission" object in the scene!');
                        return false;
                    }
                    const distance = camera.position.distanceTo(spaceMission.position);
                    return distance < 7;
                },
                action: async () => {
                    if (this.isEventInProgress) return; 

                    this.isEventInProgress = true; 
                    console.warn('Drone heading to Space Mission...');

                    const drone = this.scene.getObjectByName('Drone');
                    if (!drone) {
                        this.isEventInProgress = false; 
                        return;
                    }

                    const pointB = this.scene.getObjectByName('dron_apollo');
                    const spot = this.scene.getObjectByName('Space_Mission');
                    await flyTo(drone, drone, pointB, 5);
                    turnOnSpotlight(this.scene, spot);
                    await this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');

                    await this.playSoundAndWaitForCompletion('../public/sounds/Apollo.mp3');                    
                    this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');
                    turnOffSpotlight(this.scene);

                    this.isEventInProgress = false; 
                },
                executed: 0,
                maxExecutions: 1,
                lastExecutionTime: 0,
                executionDelay: 0,
            },
            {
                name: 'GoToPrison',
                condition: (camera, scene) => {
                    const prison = scene.getObjectByName('Prison');
                    if (!prison) {
                        console.warn('Could not find "Prison" object in the scene!');
                        return false;
                    }
                    const distance = camera.position.distanceTo(prison.position);
                    return distance < 7;
                },
                action: async () => {
                    if (this.isEventInProgress) return; 

                    this.isEventInProgress = true; 
                    console.warn('Drone heading to Prison...');

                    const drone = this.scene.getObjectByName('Drone');
                    if (!drone) {
                        this.isEventInProgress = false; 
                        return;
                    }

                    const pointB = this.scene.getObjectByName('dron_wiezien');
                    const spot = this.scene.getObjectByName('Prison');
                    await flyTo(drone, drone, pointB, 5);
                    turnOnSpotlight(this.scene, spot);
                    await this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');
                    await this.playSoundAndWaitForCompletion('../public/sounds/Prison.mp3');
                    this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');
                    turnOffSpotlight(this.scene);


                    this.isEventInProgress = false; 
                },
                executed: 0,
                maxExecutions: 1,
                lastExecutionTime: 0,
                executionDelay: 0,
            },
            {
                name: 'GoToStress',
                condition: (camera, scene) => {
                    const stress = scene.getObjectByName('Stress');
                    if (!stress) {
                        console.warn('Could not find "Stress" object in the scene!');
                        return false;
                    }
                    const distance = camera.position.distanceTo(stress.position);
                    return distance < 7;
                },
                action: async () => {
                    if (this.isEventInProgress) return; 

                    this.isEventInProgress = true; 
                    console.warn('Drone heading to Stress...');

                    const drone = this.scene.getObjectByName('Drone');
                    if (!drone) {
                        this.isEventInProgress = false; 
                        return;
                    }

                    const pointB = this.scene.getObjectByName('dron_czlowiek');
                    const spot = this.scene.getObjectByName('Stress');
                    await flyTo(drone, drone, pointB, 5);
                    turnOnSpotlight(this.scene, spot);
                    await this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');

                    await this.playSoundAndWaitForCompletion('../public/sounds/Stress.mp3');
                    this.playSoundAndWaitForCompletion('../public/sounds/Spotlight.mp3');
                    turnOffSpotlight(this.scene);


                    this.isEventInProgress = false; 
                },
                executed: 0,
                maxExecutions: 1,
                lastExecutionTime: 0,
                executionDelay: 0,
            },
        ];

        predefinedEvents.forEach((event) => this.addEvent(event));

        this.scene.traverse((object) => {
            if (object instanceof THREE.Object3D) {
                this.initialRotations.set(object.name, object.rotation.clone());
            }
        });
    }

    addEvent(event) {
        this.events.push(event);
        this.eventStates.set(event.name, event.executed);
        console.log(`Event added: ${event.name}`);
    }

    triggerEvent(eventName) {
        const event = this.events.find(event => event.name === eventName);
        if (event) {
            event.action(this.animationController, event);
        } else {
            console.warn(`Event ${eventName} not found!`);
        }
    }

    update() {
        const currentTime = Date.now();

        if (!this.backgroundSound || !this.backgroundSound.isPlaying) {
            this.playBackgroundSound('../public/sounds/BG.mp3');
        }

        if (this.isWaitingForFlight || this.isEventInProgress) return; 

        for (const event of this.events) {
            if (event.manualTriggerOnly) continue;

            if (
                (event.maxExecutions !== Infinity && event.executed < event.maxExecutions) ||
                event.maxExecutions === Infinity
            ) {
                if (
                    currentTime - event.lastExecutionTime >= event.executionDelay &&
                    event.condition(this.camera, this.scene)
                ) {
                    event.action(this.animationController, event);
                    event.executed++;
                    event.lastExecutionTime = currentTime;
                    this.eventStates.set(event.name, event.executed);
                }
            }
        }
    }

    playBackgroundSound(soundPath) {
        if (this.backgroundSound) {
            this.backgroundSound.stop(); 
        }

        this.backgroundSound = new THREE.Audio(this.audioListener);

        this.audioLoader.load(soundPath, (buffer) => {
            this.backgroundSound.setBuffer(buffer);
            this.backgroundSound.setLoop(true); 
            this.backgroundSound.setVolume(0.1); 
            this.backgroundSound.play();
            console.log(`Background sound started: ${soundPath}`);
        }, undefined, (error) => {
            console.error(`Error loading background sound: ${error}`);
        });
    }
}