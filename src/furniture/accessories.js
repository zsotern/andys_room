import * as THREE from "three";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {scene, colliders} from "../scene.js";

export let ceilingFan;

    export function createTreasureChest(){
    const lid = new THREE.Group();
    const lidMat = new THREE.MeshStandardMaterial({ color: 0x7b4b27, roughness: 0.8 });

    // Láda alja
    const lidBase = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.5, 1.5), lidMat);
    lid.add(lidBase);
    lidBase.castShadow = true;
    lidBase.receiveShadow = true;

    // Láda teteje
    const lidCurve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, 1.5, 24, 1, false, Math.PI/2, Math.PI),
        lidMat
    );
    lidCurve.rotation.x = Math.PI / 2;
    lidCurve.position.y = 0.25;
    lidCurve.castShadow = true;
    lidCurve.receiveShadow = true;
    lid.add(lidCurve);

    lid.position.set(3.4, 0.25, -3.2);
    scene.add(lid);

    colliders.push(lid);
}

export function createBookShelf(){
    const bookShelf = new THREE.Group;

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('models/Bookshelf.glb', (gltf)=>{
        const mesh = gltf.scene;
        mesh.traverse(o=>{
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;

                o.material = new THREE.MeshStandardMaterial({
                    color: 0xc89d7c,
                    map: new THREE.TextureLoader().load('textures/bookshelf/light_wood.png'),
                    normalMap: new THREE.TextureLoader().load('textures/bookshelf/light_wood_normal.png'),
                    roughnessMap: new THREE.TextureLoader().load('textures/bookshelf/light_wood_roughness.png')
                });
            }
        });
        bookShelf.add(mesh);
    });

    bookShelf.rotation.y = Math.PI/2;
    bookShelf.position.set(4.7, 0.8, -8.2);
    scene.add(bookShelf);
    bookShelf.castShadow = true;
    bookShelf.receiveShadow = true;
    colliders.push(bookShelf);
}

export function createBin(){
    const bin = new THREE.Group();

    const binMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.7,
        metalness: 0.3,
        side: THREE.DoubleSide,
    });

    const binGeo = new THREE.CylinderGeometry(0.35, 0.3, 0.7, 48, 1, true);
    const outerMat = new THREE.MeshStandardMaterial({ color: 0x666666, side: THREE.FrontSide });
    const innerMat =  new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.BackSide });

    // Külső fal
    const outer = new THREE.Mesh( binGeo, outerMat);
    outer.castShadow = true;
    outer.receiveShadow = true;
    bin.add(outer);

    // Belső fal
    const inner = new THREE.Mesh( binGeo, innerMat);
    bin.add(inner);

    // Alj
    const binBottom = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.02, 48),
        binMat
    );
    binBottom.position.y = -0.35;
    bin.add(binBottom);

    bin.position.y = 0.5;
    bin.position.set(3.4, 0.37, 0.7);
    scene.add(bin);

    colliders.push(bin);
}


export function createCeilingFan() {
    ceilingFan = new THREE.Group();

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16),
        new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.1, roughness: 0.8 }));
    ceilingFan.add(hub);

    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7 });

    for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.02, 1.1), bladeMat);
        blade.position.z = 0.55;
        blade.castShadow = true;
        blade.receiveShadow = true;
        const holder = new THREE.Group();
        holder.rotation.y = (i * Math.PI) / 2;
        holder.add(blade);
        ceilingFan.add(holder);
    }

    ceilingFan.position.set(0, 5.8, 0);
    scene.add(ceilingFan);
}

