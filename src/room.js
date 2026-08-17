import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { loadingManager } from "./loadingManager.js";

const objLoader = new OBJLoader(loadingManager);
const mtlLoader = new MTLLoader(loadingManager);

import * as THREE from "three";

import {scene, colliders} from "./scene.js";
import {createColliders} from "./furniture/train.js";

export function loadAndySignOBJMTL() {
    mtlLoader.setPath('models/');
    mtlLoader.load('Sign.mtl', (materials) => {
        materials.preload();

        objLoader.setMaterials(materials);
        objLoader.setPath('models/');
        objLoader.load('Sign.obj', (obj) => {
            obj.traverse(o => {
                if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
            });
            obj.scale.set(0.3,0.3,0.3);
            obj.position.set(-3.95, 1.7, 2.7);
            obj.rotation.y = - Math.PI / 2;
            obj.rotation.x = -Math.PI/5;
            scene.add(obj);
        });
    });
}

export function buildRoom() {
    const room = new THREE.Group();

    const roomSize = { w: 8, h: 6, d: 9 };
    const tile = 3;

    //Padló
    const floor = createFloor(roomSize.w, roomSize.d);
    floor.receiveShadow = true;
    room.add(floor);

    const wallTex = new THREE.TextureLoader().load('textures/wall/wallpaper5.png');
    wallTex.colorSpace = THREE.SRGBColorSpace;
    wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(roomSize.w / tile, roomSize.h / tile);

    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex });

    // Hátsó fal
    const [backWallLeft, backWallRight] = createBackWall(roomSize.w, roomSize.h, roomSize.d, wallMat);
    room.add(backWallLeft, backWallRight);

    // Bal fal
    const leftWall = createLeftWall(roomSize.w, roomSize.h, roomSize.d, wallMat);
    room.add(leftWall);

    // Jobb fal
    const rightWall = createRightWall(roomSize.w, roomSize.h, roomSize.d, wallMat);
    room.add(rightWall);

    // Plafon
    const ceiling = createCeiling(roomSize.w, roomSize.h, roomSize.d);
    room.add(ceiling);

    // Front fal
    const frontWall = createFrontWall(roomSize.w, roomSize.h, roomSize.d, wallMat);
    room.add(frontWall);

    const [windowBackLeft, windowBackRight, windowRight] = buildWindows(roomSize.w, roomSize.h, roomSize.d);
    room.add(windowBackLeft, windowBackRight, windowRight);

    createColliders(roomSize.w, roomSize.h, roomSize.d);

    room.receiveShadow = true;
    scene.add(room);
}

function createCeiling(width, height, depth){
    const ceilingGeo = new THREE.PlaneGeometry(width, depth);
    const ceilingMat = new THREE.MeshPhongMaterial({ color: 0xf5f6fa });

    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.position.y = height;
    ceiling.rotation.x = Math.PI / 2;

    return ceiling;
}

function createFloor(width, depth){
    const floorLoader = new THREE.TextureLoader();
    const floorTex = floorLoader.load( 'textures/floor/tileable-wood--colored--1920x1080.png' );
    floorTex.colorSpace = THREE.SRGBColorSpace;

    const floorMat = new THREE.MeshStandardMaterial({
        color: 0xC19A6B,
        map: floorTex,
    });

    const floorGeo = new THREE.PlaneGeometry(width, depth);
    const floor = new THREE.Mesh(floorGeo, floorMat);

    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.position.y = 0.01;

    return floor;
}

function createLeftWall(width, height, depth, wallMat){
    const wallGeoSide = new THREE.PlaneGeometry(depth, height);

    const leftWall = new THREE.Mesh(wallGeoSide, wallMat);
    leftWall.position.set(-width / 2, height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;

    return leftWall;
}

function createFrontWall(width, height, depth, wallMat){
    const wallGeoFront = new THREE.PlaneGeometry(width, height);

    const frontWall = new THREE.Mesh(wallGeoFront, wallMat);
    frontWall.position.set(0, height / 2, depth / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;

    return frontWall;
}

function createBackWall(width, height, depth, wallMat) {
    const backWallLeftHole  = makeWallWithWindowHole(
        width/2, height,
        [ -width * 0.005, 0 ],
        [ 1.6, 2.6 ],
        wallMat
    );
    backWallLeftHole.position.set(2, height/2, -depth/2);

    const backWallRightHole = makeWallWithWindowHole(
        width/2, height,
        [ width * 0.005, 0 ],
        [ 1.6, 2.6 ],
        wallMat
    );
    backWallRightHole.position.set(-2, height/2, -depth/2);

    return [backWallLeftHole, backWallRightHole];
}

function createRightWall(width, height, depth, wallMat){
    const rightWallHole = makeWallWithWindowHole(
        depth, height,
        [ -0.65, 0 ],
        [ 1.6, 2.6 ],
        wallMat
    );
    rightWallHole.position.set(width/2, height/2, 0);
    rightWallHole.rotation.y = -Math.PI / 2;

    return rightWallHole;
}

function makeWallWithWindowHole(width, height, holeCenter, holeSize, baseMat) {
    const wallWithWindowHole = new THREE.Group();
    const [cx, cy] = holeCenter;
    const [holeWidth,  holeHeight ] = holeSize;

    const x1 = cx - holeWidth/2, x2 = cx + holeWidth/2;
    const y1 = cy - holeHeight/2, y2 = cy + holeHeight/2;
    const Xl = -width/2, Xr =  width/2;
    const Yb = -height/2, Yt =  height/2;

    const TILE = 3;

    const addStrip = (wStrip, hStrip, xC, yC) => {
        if (wStrip <= 0 || hStrip <= 0) return;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(wStrip, hStrip), baseMat.clone());

        m.material.map = baseMat.map.clone();
        m.material.map.wrapS = m.material.map.wrapT = THREE.RepeatWrapping;
        m.material.map.repeat.set(wStrip / TILE, hStrip / TILE);

        m.position.set(xC, yC, 0);
        m.receiveShadow = true;
        wallWithWindowHole.add(m);
    };

    // Bal csík
    addStrip(x1 - Xl, height, (Xl + x1)/2, 0);
    // Jobb csík
    addStrip(Xr - x2, height, (x2 + Xr)/2, 0);
    // Felső csík
    addStrip(x2 - x1, Yt - y2, (x1 + x2)/2, (y2 + Yt)/2);
    // Alsó csík
    addStrip(x2 - x1, y1 - Yb, (x1 + x2)/2, (y1 + Yb)/2);

    return wallWithWindowHole;
}

function buildWindows(width, height, depth){
    // Hátsó fal – 2 ablak
    const windowLeft = createWindowGroup();
    windowLeft.position.set(-width * 0.25, 3, -depth / 2 );

    const windowRight = createWindowGroup();
    windowRight.position.set(width * 0.25, 3, -depth / 2 );

    // Jobb oldali fal - 1 ablak
    const windowSide = createWindowGroup();
    windowSide.rotation.y = -Math.PI / 2;
    windowSide.position.set(width / 2, 3, -0.65);

    createWindowFrame(-width * 0.25, 3, -depth / 2, "no");
    createWindowFrame(width * 0.25 , 3, -depth / 2, "no");
    createWindowFrame(width / 2, 3, -0.65, "true");

    return [windowLeft, windowRight, windowSide];
}

function createWindowGroup() {
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x88c6ff,
        transparent: true,
        opacity: 0,
        roughness: 0.15,
        transmission: 0.6
    });

    // Ablak
    const W = 1.6;
    const H = 2.6;
    const T = 0.06;   // keret vastagság
    const FW = 0.10;  // léc szélesség

    const windowsGroup = new THREE.Group();

    // 4 léc: bal, jobb, fent, lent
    const left  = new THREE.Mesh(new THREE.BoxGeometry(FW, H, T), frameMat);
    const right = new THREE.Mesh(new THREE.BoxGeometry(FW, H, T), frameMat);
    const top   = new THREE.Mesh(new THREE.BoxGeometry(W - 2*FW, FW, T), frameMat);
    const bottom= new THREE.Mesh(new THREE.BoxGeometry(W - 2*FW, FW, T), frameMat);

    left.position.set(- (W/2 - FW/2), 0, 0);
    right.position.set(  (W/2 - FW/2), 0, 0);
    top.position.set(0,  (H/2 - FW/2), 0);
    bottom.position.set(0, -(H/2 - FW/2), 0);

    windowsGroup.add(left, right, top, bottom);

    // Üveg
    const glassW = W - 2*FW;
    const glassH = H - 2*FW;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(glassW, glassH), glassMat);
    glass.position.z = T/2 + 0.001;
    windowsGroup.add(glass);

    return windowsGroup;
}

function createWindowFrame(pos_x, pos_y, pos_z, rot){
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const frame = new THREE.Group();
    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 0.2), frameMat);
    frameRight.position.x = 0.9;
    frame.add(frameRight);

    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 0.2), frameMat);
    frameLeft.position.x = -0.9;
    frame.add(frameLeft);

    const frameUpper = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), frameMat);
    frameUpper.position.y = 1.4;
    frameUpper.rotation.z = Math.PI/2;
    frame.add(frameUpper);

    const L = 2.1;     // a léc hossza (X)
    const H = 0.12;    // díszprofil magassága (Y)
    const T = 0.2;     // extrude vastagság (Z)
    const r = H / 2;   // ovális végek sugara

    const shape = new THREE.Shape();

    const xL = -L/2 + r, xR = L/2 - r;
    const yB = -H/2,     yT =  H/2;

    shape.moveTo(xL, yT);                                 // bal félkör felső érintő
    shape.lineTo(xR, yT);                                 // felső egyenes
    shape.absarc(xR, 0, r,  Math.PI/2, -Math.PI/2, true); // jobb félkör (fentről le)
    shape.lineTo(xL, yB);                                 // alsó egyenes
    shape.absarc(xL, 0, r, -Math.PI/2,  Math.PI/2, true); // bal félkör (lentről fel)
    shape.closePath();

    // extrudálás Z-ben
    const extrudeSettings = { depth: T, bevelEnabled: false, curveSegments: 32 };
    const frameUpperGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const frameUpperExtrude = new THREE.Mesh(frameUpperGeo, frameMat);


    const frameY = 1.4;               // a léc közepe
    const frameThickness = 0.2;       // a léc vastagsága
    const topOfFrame = frameY + frameThickness/2;
    frameUpperExtrude.position.set(
        0,                          // X középen
        topOfFrame + H/2,           // ALJA a léc tetején → közép = teteje + H/2
        -T/2                        // extrude -> középre Z-ben
    );

    frame.add(frameUpperExtrude);

    const frameExtraUpper = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.15, 0.25), frameMat);
    frameExtraUpper.position.y = 1.6;
    frameExtraUpper.rotation.z = Math.PI/2;
    frame.add(frameExtraUpper);

    const frameLower = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), frameMat);
    frameLower.position.y = -1.4;
    frameLower.rotation.z = Math.PI/2;
    frame.add(frameLower);

    const frameExtraLower = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.1, 0.1), frameMat);
    frameExtraLower.position.y = -1.4;
    frameExtraLower.position.z = 0.1;
    frameExtraLower.rotation.z = Math.PI/2;
    frame.add(frameExtraLower);

    frame.position.set(pos_x,pos_y,pos_z);
    scene.add(frame);

    if (rot === "true"){
        frame.rotation.y = -Math.PI/2;
    }
}

function createDoorFrames(pos_x, pos_y, pos_z, rot, material){
    const frame = new THREE.Group();
    const frameRightLeftGeo = new THREE.BoxGeometry(0.2, 4.4, 0.2);
    const frameRight = new THREE.Mesh(frameRightLeftGeo, material);
    frameRight.position.x = 0.9;
    frame.add(frameRight);

    const frameLeft = new THREE.Mesh(frameRightLeftGeo, material);
    frameLeft.position.x = -0.9;
    frame.add(frameLeft);

    const frameUpper = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2, 0.2), material);
    frameUpper.position.y = 2.2;
    frameUpper.rotation.z = Math.PI/2;
    frame.add(frameUpper);

    const L = 2.1;     // a léc hossza (X)
    const H = 0.12;    // díszprofil magassága (Y)
    const T = 0.2;     // extrude vastagság (Z)
    const r = H / 2;   // ovális végek sugara

    const shape = new THREE.Shape();

    const xL = -L/2 + r, xR = L/2 - r;
    const yB = -H/2,     yT =  H/2;

    shape.moveTo(xL, yT);                                 // bal félkör felső érintő
    shape.lineTo(xR, yT);                                 // felső egyenes
    shape.absarc(xR, 0, r,  Math.PI/2, -Math.PI/2, true); // jobb félkör (fentről le)
    shape.lineTo(xL, yB);                                 // alsó egyenes
    shape.absarc(xL, 0, r, -Math.PI/2,  Math.PI/2, true); // bal félkör (lentről fel)
    shape.closePath();

    // extrudálás Z-ben
    const extrudeSettings = { depth: T, bevelEnabled: false, curveSegments: 32 };
    const frameUpperGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const frameUpperExtrude = new THREE.Mesh(frameUpperGeo, material);


    const frameY = 2.2;               // a léc közepe
    const frameThickness = 0.2;       // a léc vastagsága (Z)
    const topOfFrame = frameY + frameThickness/2;
    frameUpperExtrude.position.set(
        0,                          // X középen
        topOfFrame + H/2,           // ALJA a léc tetején → közép = teteje + H/2
        -T/2                        // extrude → középre Z-ben
    );

    frame.add(frameUpperExtrude);

    const frameExtraUpper = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.15, 0.25), material);
    frameExtraUpper.position.y = 2.4;
    frameExtraUpper.rotation.z = Math.PI/2;
    frame.add(frameExtraUpper);

    scene.add(frame);
    colliders.push(frame);

    frame.position.set(pos_x,pos_y,pos_z);
    if (rot === "true"){
        frame.rotation.y = -Math.PI/2;
    }
}

export function buildDoors(){
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
    const doorFront = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4.4, 0.1), doorMat);
    doorFront.position.set(-1.5,2.2,4.5);
    scene.add(doorFront);

    const doorSide = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4.4, 0.1), doorMat);
    doorSide.rotation.y = Math.PI/2;
    doorSide.position.set(-4, 2.2, 2.95);
    scene.add(doorSide);

    createDoorFrames(-1.5,2.2,4.5, "false", doorMat);
    createDoorFrames(-4, 2.2, 2.95, "true", doorMat);

    colliders.push(doorSide);
    colliders.push(doorFront);
}