import * as THREE from "three";

import {scene, colliders} from "../scene.js";

export const tempBox = new THREE.Box3();
export const trainBox = new THREE.Box3();
export let miniTrain;

export function createColliders(width, height, depth){
    // láthatatlan anyag
    const blockerMat = new THREE.MeshStandardMaterial({ visible: false });

    // hátsó fal ütköző
    const backBlock = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1), blockerMat);
    backBlock.position.set(0, height/2, -depth/2);
    scene.add(backBlock);
    colliders.push(backBlock);

    // front fal ütköző
    const frontBlock = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.1), blockerMat);
    frontBlock.position.set(0, height/2,  depth/2);
    scene.add(frontBlock);
    colliders.push(frontBlock);

    // bal fal ütköző
    const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, depth), blockerMat);
    leftBlock.position.set(-width/2, height/2, 0);
    scene.add(leftBlock);
    colliders.push(leftBlock);

    // jobb fal ütköző
    const rightBlock = new THREE.Mesh(new THREE.BoxGeometry(0.1, height, depth), blockerMat);
    rightBlock.position.set( width/2, height/2, 0);
    scene.add(rightBlock);
    colliders.push(rightBlock);
}

export function checkCollision(nextPos) {
    scene.updateMatrixWorld(true);

    // aktuális vonat-doboz
    trainBox.setFromObject(miniTrain);

    // következő pozíció = aktuális + delta
    const delta = new THREE.Vector3().subVectors(nextPos, miniTrain.position);

    // következő doboz = aktuális eltolva deltával
    const nextBox = trainBox.clone().translate(delta);

    for (const c of colliders) {
        tempBox.setFromObject(c);
        if (nextBox.intersectsBox(tempBox)) {
            return true; // ütközne
        }
    }
    return false; // nem ütközne
}

export function createMiniTrain() {
    const miniTrainGroup = new THREE.Group();
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.7 });

    const trainBodyLower = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.02, 0.3),
        new THREE.MeshStandardMaterial({color: 0x0000ff, roughness: 0.7})
    );
    trainBodyLower.castShadow = true;
    miniTrainGroup.add(trainBodyLower);


    const trainBodyUpperRight = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.15, 24, 1, false, Math.PI/2, Math.PI), // félhenger
        new THREE.MeshStandardMaterial({color: 0xffff00, roughness: 0.7})
    );
    trainBodyUpperRight.rotation.x = Math.PI / 2;
    trainBodyUpperRight.position.y = 0.01;
    trainBodyUpperRight.position.z = 0.075;
    trainBodyUpperRight.castShadow = true;
    miniTrainGroup.add(trainBodyUpperRight);

    const trainBodyUpperLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 0.12, 0.15),
        new THREE.MeshStandardMaterial({color: 0x00ff00, roughness: 0.7})
    );
    trainBodyUpperLeft.position.y = 0.07;
    trainBodyUpperLeft.position.z = -0.075;
    trainBodyUpperLeft.castShadow = true;
    miniTrainGroup.add(trainBodyUpperLeft);

    const coneGeo = new THREE.ConeGeometry( 0.04, 0.05, 32 );
    const coneMat = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cone = new THREE.Mesh(coneGeo, coneMat );

    cone.rotation.x = Math.PI;
    cone.position.y = 0.12;
    cone.position.z = 0.08;
    cone.castShadow = true;
    miniTrainGroup.add( cone );

    const geometry2 = new THREE.CylinderGeometry( 0.017, 0.017, 0.05, 32 );
    const material2 = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
    const cylinder = new THREE.Mesh( geometry2, material2 );

    cylinder.position.y = 0.1;
    cylinder.position.z = 0.08;
    cylinder.castShadow = true;
    miniTrainGroup.add( cylinder );

    //front left wheel
    const wheelLFGeometry = new THREE.CylinderGeometry(
        0.03,
        0.03,
        0.01
    );

    const wheelLFMesh = new THREE.Mesh(wheelLFGeometry, wheelMat);
    wheelLFMesh.position.x = -0.08;
    wheelLFMesh.position.y = 0;
    wheelLFMesh.position.z = -0.08;
    wheelLFMesh.rotation.z = Math.PI / 2;
    wheelLFMesh.castShadow = true;
    miniTrainGroup.add(wheelLFMesh);

    //front right wheel
    const wheelRFGeometry = new THREE.CylinderGeometry(
        0.03,
        0.03,
        0.01
    );

    const wheelRFMesh = new THREE.Mesh(wheelRFGeometry, wheelMat);
    wheelRFMesh.position.y = 0;
    wheelRFMesh.position.x = 0.08;
    wheelRFMesh.position.z = -0.08;
    wheelRFMesh.castShadow = true;
    wheelRFMesh.rotation.z = Math.PI / 2;
    miniTrainGroup.add(wheelRFMesh);

    //back left wheel
    const wheelLBGeometry = new THREE.CylinderGeometry(
        0.03,
        0.03,
        0.01
    )

    const wheelLBMesh = new THREE.Mesh(wheelLBGeometry, wheelMat);
    wheelLBMesh.position.y = 0;
    wheelLBMesh.position.x = -0.08;
    wheelLBMesh.position.z = 0.08;
    wheelLBMesh.rotation.z = Math.PI / 2;
    wheelLBMesh.castShadow = true;
    miniTrainGroup.add(wheelLBMesh);

    //back right wheel
    const wheelRBGeometry = new THREE.CylinderGeometry(
        0.03,
        0.03,
        0.01
    )

    const wheelRBMesh = new THREE.Mesh(wheelRBGeometry, wheelMat);
    wheelRBMesh.position.y = 0;
    wheelRBMesh.position.x = 0.08;
    wheelRBMesh.position.z = 0.08;
    wheelRBMesh.castShadow = true;
    wheelRBMesh.rotation.z = Math.PI / 2;
    miniTrainGroup.add(wheelRBMesh);

    miniTrainGroup.position.set(0,0.03,0);
    miniTrainGroup.castShadow = true;
    miniTrainGroup.receiveShadow = true;

    miniTrain = miniTrainGroup;

    scene.add(miniTrainGroup);
}

