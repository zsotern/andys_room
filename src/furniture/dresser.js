import * as THREE from "three";
import {scene, colliders} from "../scene.js";

function createHandleForDrawer(pos_x, pos_y, pos_z, material){

    const handleGeo = new THREE.CylinderGeometry( 0.05, 0.05, 0.1, 32 );
    const handle = new THREE.Mesh( handleGeo, material );
    handle.position.set(pos_x, pos_y, pos_z);
    handle.rotation.x = Math.PI / 2;
    handle.rotation.z = Math.PI / 2;
    handle.receiveShadow = true;
    scene.add( handle );
}

export function createDrawerForDresser(pos_x, pos_y, pos_z, width, height, material, depth=0.2, rot="true") {
    // Fiók homloklap formája
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    shape.closePath();

    // Extrudálási beállítások
    const extrudeSettings = {
        steps: 1,
        depth: depth,        // előre nyúlás
        bevelEnabled: true,
        bevelThickness: 0.05, // lekerekítés vastagsága (2 cm)
        bevelSize: 0.05,     // lekerekítés mérete
        bevelOffset: 0,
        bevelSegments: 2
    }

    const drawerGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const drawer = new THREE.Mesh(drawerGeo, material);
    drawer.receiveShadow = true;
    drawer.position.set(pos_x, pos_y, pos_z);
    if (rot === "true"){
        drawer.rotation.y = Math.PI / 2;
    }

    return drawer;
}

export function buildSmallDresser(){
    const dresser = new THREE.Group;
    const dresserTexLoader = new THREE.TextureLoader();
    const dresserTex= dresserTexLoader.load( 'textures/small_dresser/pink-toy-bump.png' );
    dresserTex.colorSpace = THREE.SRGBColorSpace;

    const dresserMat = new THREE.MeshStandardMaterial({
        color: 0xffc2d4,
        map: dresserTex,
        bumpScale: 0.001,
        bumpMap: new THREE.TextureLoader().load('textures/small_dresser/pink_toy_bump_normal.jpg'),
        roughness: 0.3
    });

    const deskUpper = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.12, 1.1), dresserMat);
    deskUpper.position.y = 0.8;
    deskUpper.receiveShadow = true;
    deskUpper.castShadow = true;
    dresser.add(deskUpper);

    const dresserBody = new THREE.Mesh(new THREE.BoxGeometry(1, 1.7, 1), dresserMat);
    dresserBody.castShadow = true;
    dresser.add(dresserBody);

    dresser.position.set(3.4, 0.85, 1.6);

    // Fiók hozzáadása

    dresser.add(createDrawerForDresser(-0.5, 0.35, 0.35, 0.7, 0.25, dresserMat));
    dresser.add(createDrawerForDresser(-0.5, -0.7, 0.35, 0.7, 0.8, dresserMat));

    // Fogantyúk a fiókokra
    const handlerMat = new THREE.MeshStandardMaterial( {color: 0x999999} );
    createHandleForDrawer(2.88, 1.325, 1.6, handlerMat);
    createHandleForDrawer(2.88, 0.8, 1.6, handlerMat);

    scene.add(dresser);
    colliders.push(dresser);
}

export function buildDresser(){
    const dresser = new THREE.Group;
    const dresserMat = new THREE.MeshPhongMaterial({ color: 0xfffce9 });

    const deskUpper = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 2), dresserMat);
    deskUpper.position.y = 1;
    dresser.add(deskUpper);

    const deskLower = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 1.8), dresserMat);
    deskLower.position.y = -0.95;
    dresser.add(deskLower);

    const dresserBody = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1.8), dresserMat);
    dresser.add(dresserBody);
    dresserBody.receiveShadow = true;

    const dresserLegRightBack= new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.14), dresserMat);
    dresserLegRightBack.position.set(-0.4,-1,-0.7);
    dresser.add(dresserLegRightBack);

    const dresserLegRightFront= new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.14), dresserMat);
    dresserLegRightFront.position.set(0.4,-1,-0.7);
    dresser.add(dresserLegRightFront);

    const dresserLegLeftBack= new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.14), dresserMat);
    dresserLegLeftBack.position.set(-0.4,-1, 0.7);
    dresser.add(dresserLegLeftBack);

    const dresserLegLeftFront= new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.14), dresserMat);
    dresserLegLeftFront.position.set(0.4,-1,0.7);
    dresser.add(dresserLegLeftFront);

    dresser.add(createDrawerForDresser(0.3, 0.55, -0.2, 0.55, 0.25, dresserMat));
    createHandleForDrawer(-2.88, 1.825, 0.15, dresserMat);

    dresser.add(createDrawerForDresser(0.3, 0.55, 0.68,  0.55, 0.25, dresserMat));
    createHandleForDrawer(-2.88, 1.825, 1, dresserMat);

    dresser.add(createDrawerForDresser(0.3, 0.04, 0.72, 1.5, 0.25, dresserMat));
    createHandleForDrawer(-2.88, 1.325, 0.15, dresserMat);
    createHandleForDrawer(-2.88, 1.325, 1, dresserMat);

    dresser.add(createDrawerForDresser(0.3, -0.4, 0.72, 1.5, 0.25, dresserMat));
    createHandleForDrawer(-2.88, 0.875, 0.15, dresserMat);
    createHandleForDrawer(-2.88, 0.875, 1, dresserMat);

    dresser.add(createDrawerForDresser(0.3, -0.85, 0.72, 1.5, 0.25, dresserMat));
    createHandleForDrawer(-2.88, 0.425, 0.15, dresserMat);
    createHandleForDrawer(-2.88, 0.425, 1, dresserMat);

    dresser.position.set(-3.4, 1.15, 0.6);
    scene.add(dresser);

    colliders.push(dresser);
}