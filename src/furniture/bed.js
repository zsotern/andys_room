import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { loadingManager } from "../loadingManager.js";

import {scene, colliders} from "../scene.js";

import * as THREE from "three";

const gltfLoader = new GLTFLoader(loadingManager);

const mattressMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeff, roughness: 1.0 });


export function buildBed() {
    const bed = new THREE.Group();

    const bedMat = new THREE.MeshStandardMaterial({ color: 0x3e7bdc, roughness: 0.9 });
    const loader = new THREE.TextureLoader();


    gltfLoader.load('models/Andys_bed.glb', (gltf)=>{
        const mesh = gltf.scene;
        mesh.traverse(o=>{
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;

                o.material = new THREE.MeshStandardMaterial({
                    color: 0x964B00,
                    map: loader.load('textures/bed/wood_albedo.png'),
                    normalMap: loader.load('textures/bed/wood_normal.png'),
                    roughnessMap: loader.load('textures/bed/wood_roughness.png')
                });
            }
        });
        mesh.position.set(-0.2, 0.7, 2.2);
        bed.add(mesh);
    });

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 4), mattressMaterial);
    mattress.position.y = 0.3;
    mattress.position.x = -0.2;
    mattress.position.z = 0.2;
    mattress.castShadow = true; mattress.receiveShadow = true;
    bed.add(mattress);

    const blanket = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.05, 3.1), bedMat);
    blanket.position.set(-0.2, 0.4, 0.55);
    blanket.castShadow = true; blanket.receiveShadow = true;
    bed.add(blanket);

    const pillow = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.4), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 }));
    pillow.position.set(-0.2, 0.4, -1.4);
    pillow.castShadow = true; pillow.receiveShadow = true;
    bed.add(pillow);

    bed.rotation.y = Math.PI / 2; // keresztben
    bed.position.set(-2, 0.31, -3.3);

    scene.add(bed);
    colliders.push(bed);
}

export function buildSmallBed() {
    const bed = new THREE.Group();

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('models/Mollys_bed.glb', (gltf)=>{
        const mesh = gltf.scene;
        mesh.traverse(o=>{
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
        mesh.position.set(0.4, 1, 2.3);
        bed.add(mesh);
    });


    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.22, 3), mattressMaterial);
    mattress.position.y = 0.6;
    mattress.position.z = -0.12;
    mattress.position.x = 0.2;
    mattress.castShadow = true; mattress.receiveShadow = true;
    bed.add(mattress);

    bed.rotation.y = Math.PI / 2;
    bed.position.set(2.35, 0.2, 3.55);

    scene.add(bed);
    colliders.push(bed);
}