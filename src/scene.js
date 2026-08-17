import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as THREE from "three";

import {setupInteractions} from "./interactions.js";
import {buildDoors, buildRoom, loadAndySignOBJMTL} from "./room.js";
import {buildBed, buildSmallBed} from "./furniture/bed.js";
import {buildWritingDesk, createDesk} from "./furniture/desk.js";
import {createBin, createBookShelf, createCeilingFan, createTreasureChest} from "./furniture/accessories.js";
import {buildDresser, buildSmallDresser} from "./furniture/dresser.js";
import {
    applyDayNight,
    createAndysLamp,
    createCeilingPointLight,
    createDeskLamp,
    createMollysLamp,
    setupLights
} from "./lights.js";

import {createMiniTrain} from "./furniture/train.js";

export let renderer, scene, camera, controls, clock;

export let defaultCamState;         // kamera reset-hez

export const colliders = [];

export function init() {
    const container = document.getElementById('app');

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();

    // Kamera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(6, 4, 8);
    camera.lookAt(0, 1.2, 0);
    defaultCamState = camera.position.clone();

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.2, 0);

    clock = new THREE.Clock();

    buildScene();
    setupLights();
    setupInteractions();

    // Nappal állapot beállítása
    applyDayNight(true);
}

function buildScene(){
    loadAndySignOBJMTL();

    buildRoom();
    buildBed();
    buildSmallBed();
    buildWritingDesk();
    createTreasureChest();
    createBookShelf();
    buildDoors();
    buildDresser();
    buildSmallDresser();
    createDesk();
    createBin();
    createDeskLamp();
    createAndysLamp();
    createMollysLamp();
    createCeilingFan();
    createCeilingPointLight();
    createMiniTrain();
}

export function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}