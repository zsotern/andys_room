import * as THREE from "three";

import {scene, colliders} from "../scene.js";
import {createDrawerForDresser} from "./dresser.js";


export function buildWritingDesk(){
    const writingDesk =  new THREE.Group();
    const drawerMat = new THREE.MeshStandardMaterial({ color: 0xa63535, roughness: 0.8 });
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xad6f55, roughness: 0.8 });

    const drawer = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.15, 0.9), drawerMat);
    drawer.position.y = 0.15;
    drawer.position.z = -0.795;
    drawer.castShadow = true;
    drawer.receiveShadow = true;
    writingDesk.add(drawer);

    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), drawerMat);
    leg1.position.x = -0.56;
    leg1.position.z = 1.2;
    leg1.castShadow = true;
    writingDesk.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), drawerMat);
    leg2.position.x = 0.56;
    leg2.position.z = 1.2;
    leg2.castShadow = true;
    writingDesk.add(leg2);

    const leg3 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), drawerMat);
    leg3.position.x = -0.56;
    leg3.position.z = -1.2;
    leg3.castShadow = true;
    writingDesk.add(leg3);

    const leg4 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 0.1), drawerMat);
    leg4.position.x = 0.56;
    leg4.position.z = -1.2;
    leg4.castShadow = true;
    writingDesk.add(leg4);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.15, 2.45), drawerMat);
    backWall.position.y = 0.15;
    backWall.position.z = 0;
    backWall.position.x = 0.586;
    backWall.castShadow = true;
    writingDesk.add(backWall);

    const desk = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 2.52), deskMat);
    desk.position.y = 0.76;
    desk.castShadow = true;
    desk.receiveShadow = true;
    writingDesk.add(desk);

    writingDesk.add(createDrawerForDresser(-0.6, 0.3, -0.5, 0.6, 0.25, drawerMat));
    writingDesk.add(createDrawerForDresser(-0.6, -0.3, -0.5, 0.6, 0.4, drawerMat));

    writingDesk.position.set(3.15, 0.7, -1)
    writingDesk.castShadow = true;
    writingDesk.receiveShadow = true;

    scene.add(writingDesk);
    colliders.push(writingDesk);
}

export function createDesk(){
    const desk = new THREE.Group;
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });

    const deskUpper = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 0.8), deskMat);
    deskUpper.position.y = 0.75;
    deskUpper.position.z = -0.3;
    deskUpper.receiveShadow = true;
    desk.add(deskUpper);

    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.5, 0.13), deskMat);
    leg1.position.x = -0.4;
    leg1.position.z = 0;
    desk.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.5, 0.13), deskMat);
    leg2.position.x = 0.4;
    leg2.position.z = 0;
    desk.add(leg2);

    const leg3 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.5, 0.13), deskMat);
    leg3.position.x = -0.4;
    leg3.position.z = -0.6;
    desk.add(leg3);

    const leg4 = new THREE.Mesh(new THREE.BoxGeometry(0.13, 1.5, 0.13), deskMat);
    leg4.position.x = 0.4;
    leg4.position.z = -0.6;
    desk.add(leg4);

    const drawer = createDrawerForDresser(-0.385, 0.45, -0.58, 0.76, 0.2, deskMat, 0.65, "false");
    //drawer.castShadow = true;
    desk.add(drawer);

    desk.rotation.y = Math.PI/2;
    desk.position.set(-3.2,0.75, -1.25);
    scene.add(desk);

    colliders.push(desk);
}