import * as THREE from "three";

import {scene} from "./scene.js";

export  let sun, ambient, lampLight; // fények
export let dayMode = true;          // nappal/éjszaka állapot

export let ceilingPoint;

export function setupLights(){
    // globális ambiens
    ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    // Nap
    sun = new THREE.DirectionalLight(0xffffff, 0);
    sun.position.set(6, 10, 4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
    sun.shadow.camera.left = -15;
    sun.shadow.camera.right = 15;
    sun.shadow.camera.top = 15;
    sun.shadow.camera.bottom = -15;

    scene.add(sun);
}

export function createDeskLamp() {
    // Asztali lámpa + SpotLight (ki/be kapcsolható)
    const lamp = new THREE.Group();
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.6, roughness: 0.4 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 24), lampMat);
    base.receiveShadow = true;
    lamp.add(base);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 20), lampMat);
    stem.position.y = 0.25;
    lamp.add(stem);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.3, 24), lampMat);
    head.position.set(0, 0.55, 0);
    head.rotation.x = -Math.PI/4;
    lamp.add(head);

    // Spot fény a lámpafejben
    lampLight = new THREE.SpotLight(0xfff2c5, 1.3, 6, Math.PI/6, 0.3, 1.2);
    lampLight.position.set(0, -0.14, 0);
    lampLight.target.position.set(0, -1, 0);

    lampLight.angle = Math.PI / 7;   // keskenyebb fénykúp
    lampLight.penumbra = 0.35;       // lágyabb szél
    lampLight.decay = 1.5;

    head.add(lampLight);
    head.add(lampLight.target);

    lamp.position.set(3.4, 1.55, -1.8);
    lamp.rotation.y = -Math.PI/3;

    scene.add(lamp);
}

export function createAndysLamp(){
    const lamp = new THREE.Group();

    // Lámpa alja
    const base = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2 + 0.5),
        new THREE.MeshPhysicalMaterial({
            color: 0xff6600,
            roughness: 0.5,
            metalness: 0.06,
            clearcoat: 0.30,
        })
    );

    base.position.x = -1;
    base.receiveShadow = true;
    lamp.add(base);

    // Lámpa váz
    const stemGeo = new THREE.CylinderGeometry( 0.02, 0.02, 0.35, 32 );
    const stemMat = new THREE.MeshStandardMaterial( { color: 0x7a5230 } );
    const stem = new THREE.Mesh( stemGeo, stemMat );
    stem.position.x = -1;
    stem.position.y = 0.3;
    lamp.add( stem );

    // Lámpa váz keresztben
    const stemCrosswiseGeo = new THREE.CylinderGeometry( 0.005, 0.0055, 0.5, 32 );
    const stemCrosswise = new THREE.Mesh( stemCrosswiseGeo, stemMat );
    stemCrosswise.rotation.x = Math.PI/2;
    stemCrosswise.position.x = -1;
    stemCrosswise.position.y = 0.4;
    lamp.add( stemCrosswise );

    // Lámpabúra
    const topRadius = 0.2;
    const bottomRadius = 0.3;
    const height = 0.4;

    const shadeGeo = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 32, 1, true);
    const shadeMatOuter = new THREE.MeshStandardMaterial({ color: 0xFAF9F6, side: THREE.FrontSide });
    const shadeMatInner =  new THREE.MeshStandardMaterial({ color: 0xFAF9F6, side: THREE.BackSide });

    // külső fal
    const shadeOuter = new THREE.Mesh(shadeGeo, shadeMatOuter);
    shadeOuter.position.x = -1;
    shadeOuter.position.y = 0.45;
    lamp.add(shadeOuter);

    // belső fal
    const ShadeInner = new THREE.Mesh(shadeGeo, shadeMatInner);
    ShadeInner.position.x = -1;
    ShadeInner.position.y = 0.45;
    lamp.add(ShadeInner);

    lamp.position.set(-2.5, 1.6, -1.3);
    scene.add(lamp);
}

export function createMollysLamp(){
    const lamp = new THREE.Group();

    // Lámpa alja
    const baseGeo = new THREE.CylinderGeometry( 0.3, 0.3, 0.02, 32 );
    const baseMat = new THREE.MeshStandardMaterial( { color: 0x77dd77 } );
    const base = new THREE.Mesh( baseGeo, baseMat );
    base.position.x = -1;
    base.receiveShadow = true;
    lamp.add( base );

    // Lámpa váz
    const stemGeo = new THREE.CylinderGeometry( 0.01, 0.01, 0.4, 32 );
    const stemMat = new THREE.MeshStandardMaterial( { color: 0xFAF9F6 } );
    const stem = new THREE.Mesh( stemGeo, stemMat );
    stem.position.x = -1.1;
    stem.position.y = 0.2;
    stem.receiveShadow = true;
    lamp.add( stem );

    // Lámpa váz keresztben
    const stemCrossWiseGeo = new THREE.CylinderGeometry( 0.005, 0.0055, 0.3, 32 );
    const stemCrossWiseMat = new THREE.MeshStandardMaterial( { color: 0xFAF9F6 } );
    const stemCrossWise = new THREE.Mesh( stemCrossWiseGeo, stemCrossWiseMat );
    stemCrossWise.rotation.x = Math.PI/2;
    stemCrossWise.position.x = -1.1;
    stemCrossWise.position.y = 0.4;
    lamp.add( stemCrossWise );

    // Lámpabúra
    const topRadius = 0.1;
    const bottomRadius = 0.2;
    const height = 0.3;

    const shadeGeo = new THREE.CylinderGeometry(topRadius, bottomRadius, height, 32, 1, true);
    const shadeOuterMat = new THREE.MeshStandardMaterial({ color: 0x79ece0, side: THREE.FrontSide });
    const shadeInnerMat =  new THREE.MeshStandardMaterial({ color: 0x79ece0, side: THREE.BackSide });

    // külső fal
    const shadeOuter = new THREE.Mesh(shadeGeo, shadeOuterMat);
    shadeOuter.position.x = -1.1;
    shadeOuter.position.y = 0.45;
    lamp.add(shadeOuter);

    // belső fal
    const shadeInner = new THREE.Mesh(shadeGeo, shadeInnerMat);
    shadeInner.position.x = -1.1;
    shadeInner.position.y = 0.45;
    lamp.add(shadeInner);

    lamp.position.set(2.6, 1.72, 1.8);
    lamp.rotation.y = Math.PI;
    scene.add(lamp);
}

export function createCeilingPointLight() {
    const ceilingHeight = 6;

    ceilingPoint = new THREE.PointLight( 0xffffff, 2, 0, 0);
    ceilingPoint.position.set(0, ceilingHeight - 0.15, 0);

    // Kis búra
    const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 15, 15),
        new THREE.MeshStandardMaterial({
            color: 0xffd242,
        })
    );
    bulb.position.y = -0.1;
    ceilingPoint.add(bulb);

    // Kis búra
    const bulb2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 15, 15),
        new THREE.MeshStandardMaterial({
            color: 0xffe286,
            transparent: true,
            opacity: 0.3
        })
    );
    bulb2.position.y = 5.75;
    scene.add(bulb2);

    scene.add(ceilingPoint);
}

export function applyDayNight(nextIsDay) {
    dayMode = nextIsDay;

    if (dayMode) {
        scene.background = new THREE.Color(0xfffcc9);
        ambient.intensity = 0.35;
        sun.intensity = 1.1;
        sun.color.set(0xffffff);
    } else {
        scene.background = new THREE.Color(0x0b1220);
        ambient.intensity = 0.15;
        sun.intensity = 0.15;
        sun.color.set(0xbad1ff);
    }
}
