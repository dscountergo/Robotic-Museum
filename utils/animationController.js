import * as THREE from 'three';

export class AnimationController {
    constructor() {
        this.mixers = new Map(); 
        this.actions = new Map(); 
    }

    addModel(modelName, mixer, animations) {
        if (mixer) {
            this.mixers.set(modelName, mixer);
            this.actions.set(modelName, {});
            animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                this.actions.get(modelName)[clip.name] = action;
            });
        } else {
            console.warn(`Mixer dla modelu ${modelName} jest null!`);
        }
    }

play(modelName, animationName, loopType = THREE.LoopRepeat, loopCount = Infinity) {
    const action = this.getAction(modelName, animationName);
    if (action) {
        action.reset();

        if (loopCount === 0) {
            action.setLoop(THREE.LoopOnce, 1);  
            action.timeScale = 1;
            action.play();
            action.stop(); 
        } else {
            action.setLoop(loopType, loopCount);
            action.play();
        }
    }
}

    pause(modelName, animationName) {
        const action = this.getAction(modelName, animationName);
        if (action) {
            action.paused = true;
        }
    }

    resume(modelName, animationName) {
        const action = this.getAction(modelName, animationName);
        if (action) {
            action.paused = false;
        }
    }

    stopAtEnd(modelName, animationName) {
        const action = this.getAction(modelName, animationName);
        if (action) {
            action.reset();
            action.clampWhenFinished = true;
            action.setLoop(THREE.LoopOnce);
            action.timeScale = 1;

            action.play();
        }
    }

    playReverse(modelName, animationName, loopType = THREE.LoopRepeat, loopCount = Infinity) {
    const action = this.getAction(modelName, animationName);
    if (action) {
        action.reset();
        action.setLoop(loopType, loopCount);
        action.timeScale = -1; 
        action.play();
    }

}

    update(delta) {
        this.mixers.forEach((mixer) => {
            if (mixer) {
                mixer.update(delta);
            } else {
                console.warn("Mixer jest null, nie można go zaktualizować.");
            }
        });
    }

    getAction(modelName, animationName) {
        const actions = this.actions.get(modelName);
        if (!actions) {
            console.warn(`Nie znaleziono modelu: ${modelName}`);
            return null;
        }
        const action = actions[animationName];
        if (!action) {
            console.warn(`Nie znaleziono animacji: ${animationName} dla modelu: ${modelName}`);
            return null;
        }
        return action;
    }
}