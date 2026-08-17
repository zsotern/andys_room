import * as THREE from "three";

import {camera, clock, controls, renderer, scene} from "./scene.js";
import { applyDayNight, dayMode, lampLight } from "./lights.js";
import {ceilingFan} from "./furniture/accessories.js";
import {resetCamera, toast, toggleInfo} from "./ui.js";
import {checkCollision, miniTrain} from "./furniture/train.js";

export let lastT = 0; // dt

// Animálható objektumok
export let ceilingPoint;

export const keys = { ArrowUp:false, ArrowDown:false, ArrowLeft:false, ArrowRight:false };

export let trainActive = false; // kijelölés

export function setTrainActive(v) {
    trainActive = v;
}

const moveSpeed = 2.0;
const turnSpeed = Math.PI;

export function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Ventilátor forgása
    if (ceilingFan) ceilingFan.rotation.y = t * 1.2;

    const dt = Math.min(0.05, t - lastT);
    lastT = t;

    if (trainActive) {
        // forgatás bal/jobb
        if (keys.ArrowLeft)  miniTrain.rotation.y += turnSpeed * dt;
        if (keys.ArrowRight) miniTrain.rotation.y -= turnSpeed * dt;

        // előre/hátra lokális Z mentén (talaj síkban)
        const dir = new THREE.Vector3(0,0,-1).applyQuaternion(miniTrain.quaternion);
        dir.y = 0; dir.normalize();

        const nextPos = miniTrain.position.clone();
        if (keys.ArrowUp)   nextPos.addScaledVector(dir, -moveSpeed * dt);
        if (keys.ArrowDown) nextPos.addScaledVector(dir,  moveSpeed * dt);

        // ütközés esetén nem módosítjuk a vonat pozícióját
        if (!checkCollision(nextPos)) {
            miniTrain.position.copy(nextPos);
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

export function onKey(e) {
    const k = e.key.toLowerCase();

    // ha aktív a vonat és nyíl jön
    if (trainActive && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
        return;
    }

    switch (k) {
        case 'i': toggleInfo(); break;
        case 'n': applyDayNight(!dayMode); toast(dayMode ? 'Nappal mód' : 'Éjszaka mód'); break;
        //case 'h': frontWallGroup.visible = !frontWallGroup.visible; toast(frontWallGroup.visible ? 'Fal: be' : 'Fal: ki'); break;
        case 'l': lampLight.visible = !lampLight.visible; toast(lampLight.visible ? 'Lámpa: be' : 'Lámpa: ki'); break;
        case 'r': resetCamera(); toast('Kamera reset'); break;
        case 'v':
            if (ceilingPoint) {
                ceilingPoint.visible = !ceilingPoint.visible;
                toast(ceilingPoint.visible ? 'Villany: be' : 'Villany: ki');
            }
            break;
    }
}

export function onKeyUp(e) {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        keys[e.key] = false;
    }
}