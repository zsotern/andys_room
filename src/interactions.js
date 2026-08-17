import * as THREE from "three";
import {onKey, onKeyUp, trainActive} from "./animation.js";
import {camera, onResize, renderer, scene} from "./scene.js";
import {miniTrain} from "./furniture/train.js";

export function setupInteractions(){
    // Eseménykezelés
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);

    // Egérrel kattintás - kisvonat mozgatáshoz
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('pointerdown', (e) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(scene.children, true);


        trainActive = hits.some(h => {
            let o = h.object;
            while (o) { if (o === miniTrain) return true; o = o.parent; }
            return false;
        });

        renderer.domElement.style.cursor = trainActive ? 'move' : 'default';
    });
}