import * as THREE from 'three';
import {body} from './utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as TWEEN from '@tweenjs/tween.js';
import texture1 from './texture1.jpg';
import texture2 from './texture2.jpg';
import texture3 from './texture3.jpg';
import grass from './grass.jpg';
import road from "./singleRoad.jpg";
import car from './Buddy.fbx';
import cityLight from './Street_Lamp.fbx';
import roadTurn from './turn.jpg';

const scene = new THREE.Scene();
const city = new THREE.Object3D();
const trafficGroup = new THREE.Group();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01 , 1000 );
camera.position.set(3, 10, 20);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);

body.append(renderer.domElement);

const textureLoader = new THREE.TextureLoader();

//background
scene.background = new THREE.Color('#eaafc8');
// fog
// scene.fog = new THREE.Fog('#eaafc8', 15, 35);
// scene.fog = new THREE.FogExp2('#eaafc8', 0.03);
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 25;
controls.maxPolarAngle = Math.PI/3;
controls.minPolarAngle = Math.PI/6;

controls.keys = {
	LEFT: 'ArrowLeft',
	UP: 'ArrowUp', 
	RIGHT: 'ArrowRight',
	BOTTOM: 'ArrowDown'
}

const cubeTextures = [
    new THREE.MeshStandardMaterial({map: textureLoader.load(texture1)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(texture2)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(texture3)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(texture1)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(texture2)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(texture3)}),
];

//initialize FBX loader
const fbxLoader = new FBXLoader();

//step 1: create buildings as primitives
const house1Geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
house1Geometry.translate(0, 0.5, 0);

const house1 = new THREE.Mesh(house1Geometry, cubeTextures);
house1.scale.set(5, 12, 5);
house1.position.set(-5.5, 0, 2);

scene.add(house1);

const house2Geometry = new THREE.BoxGeometry(2, 2, 2, 8, 8, 8);
house2Geometry.translate(0, 0.5, 0);
const house2 = new THREE.Mesh(house2Geometry, cubeTextures);
house2.scale.set(2, 3, 1.5);
house2.position.set(4, 0, -3);
scene.add(house2);

const house3 = new THREE.Mesh(house2Geometry, cubeTextures);
house3.scale.set(2, 3, 1.5);
house3.rotateY(Math.PI/2)
house3.position.set(4, 0, 3);
scene.add(house3);


function createCity() {
    //ground
    const groundGeometry = new THREE.PlaneBufferGeometry(50, 50, 64, 64);
    const groundMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load(grass)});
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI * 0.5;
    city.add(ground);
   
    //roads
    const roadGeometry = new THREE.PlaneBufferGeometry(10, 10, 32, 32);
    const road3Geometry = new THREE.PlaneBufferGeometry(10, 20, 32, 32);

    const road1 = new THREE.Mesh(roadGeometry, new THREE.MeshStandardMaterial({map: textureLoader.load(road)}));
    road1.rotation.x = -Math.PI * 0.5;
    road1.position.x = -15;
    road1.position.y = 0.2;
    city.add(road1);

    const road2 = new THREE.Mesh(roadGeometry, new THREE.MeshStandardMaterial({map: textureLoader.load(road)}));
    road2.rotation.x = -Math.PI * 0.5;
    road2.position.x = road1.position.x;
    road2.position.z = 10;
    road2.position.y = 0.2;
    city.add(road2);

    const turnRoad = new THREE.Mesh(roadGeometry, new THREE.MeshStandardMaterial({map: textureLoader.load(roadTurn)}));
    turnRoad.rotation.x = -Math.PI * 0.5;
    turnRoad.position.x = road2.position.x;
    turnRoad.position.z = road2.position.z - 20;
    turnRoad.position.y = 0.2;
    city.add(turnRoad);

    const road3 = new THREE.Mesh(road3Geometry, new THREE.MeshStandardMaterial({map: textureLoader.load(road)}));
    road3.rotation.x = -Math.PI * 0.5;
    road3.rotateZ(-road2.rotation._x);
    road3.position.x = turnRoad.position.x + 15;
    road3.position.z = turnRoad.position.z;
    road3.position.y = 0.2;
    city.add(road3);

    const turnRoad2 = new THREE.Mesh(roadGeometry, new THREE.MeshStandardMaterial({map: textureLoader.load(roadTurn)}));
    turnRoad2.rotation.x = -Math.PI * 0.5;
    turnRoad2.rotateZ(-turnRoad.rotation._x*3);
    turnRoad2.position.x = road3.position.x + 15;
    turnRoad2.position.z = road3.position.z;
    turnRoad2.position.y = 0.2;
    // console.log(turnRoad.rotation);
    // turnRoad2.rotateZ();
    city.add(turnRoad2);

    const road4 = new THREE.Mesh(road3Geometry, new THREE.MeshStandardMaterial({map: textureLoader.load(road)}));
    road4.rotation.x = -Math.PI * 0.5;
    road4.position.x = turnRoad2.position.x;
    road4.position.z = turnRoad2.position.z + 15;
    road4.position.y = 0.2;
    city.add(road4);

    const road5 = new THREE.Mesh(road3Geometry, new THREE.MeshStandardMaterial({map: textureLoader.load(road)}));
    road5.rotation.x = -Math.PI * 0.5;
    road5.position.z = road4.position.z + 5;
    road5.position.y = 0.2;
    road5.rotateZ(-road4.rotation._x);
    city.add(road5);

    //Step 2: Create car
    fbxLoader.load(car, (model) => {
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(road1.position.x, road1.position.y + 2.25, road1.position.z + 10);
        model.rotateY(road1.rotation._x);
        
        //car aniamtion
        const tweenA = new TWEEN.Tween(model.position)
        .to({z: turnRoad.position.z}, 2000).easing(TWEEN.Easing.Cubic.InOut)
        .start();

        const tweenB = new TWEEN.Tween(model.rotation)
        .to({y: -3.2}, 500).easing(TWEEN.Easing.Cubic.InOut);

        const tweenC = new TWEEN.Tween(model.position)
        .to({x: turnRoad2.position.x}, 2000).easing(TWEEN.Easing.Cubic.InOut);

        const tweenD = new TWEEN.Tween(model.rotation)
        .to({y: -4.8}, 500).easing(TWEEN.Easing.Cubic.InOut);
        
        const tweenE = new TWEEN.Tween(model.position)
        .to({z: road5.position.z}, 2000).easing(TWEEN.Easing.Cubic.InOut);

        const tweenF = new TWEEN.Tween(model.rotation)
        .to({y: -6.3}, 1000).easing(TWEEN.Easing.Cubic.InOut);

        const tweenG = new TWEEN.Tween(model.position)
        .to({x: road1.position.x}, 2000).easing(TWEEN.Easing.Cubic.InOut);

        const tweenH = new TWEEN.Tween(model.rotation)
        .to({y: -8}, 500).easing(TWEEN.Easing.Cubic.InOut);

        tweenA.chain(tweenB, tweenC);
        tweenC.chain(tweenD, tweenE);
        tweenE.chain(tweenF, tweenG);
        tweenG.chain(tweenH, tweenA);

        scene.add(model);
    });

    //city light
    fbxLoader.load(cityLight, (model) => {
        const light1 = new THREE.SpotLight('#fc642d', 0.8, 20, Math.PI/6, 0.9, 1);
        light1.position.set(house1.position.x - 2, 10, house1.position.z -5.5);
        light1.target.position.set(house1.position.x - 2, 0, house1.position.z - 9);
        scene.add(light1);
        scene.add(light1.target);
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(house1.position.x -2, house1.position.y, house1.position.z - 5.5);
        model.rotateY(Math.PI/2);
        scene.add(model);
    });
    //city light
    fbxLoader.load(cityLight, (model) => {
        const light2 = new THREE.SpotLight('#fc642d', 0.8, 20, Math.PI/6, 0.9, 1);
        light2.position.set(house1.position.x, 10, house1.position.z -5.5);
        light2.target.position.set(house1.position.x, 0, house1.position.z - 9);
        scene.add(light2);
        scene.add(light2.target);
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(house1.position.x, house1.position.y, house1.position.z - 5.5);
        model.rotateY(Math.PI/2);
        scene.add(model);
    });
    //city light
    fbxLoader.load(cityLight, (model) => {
        const light3 = new THREE.SpotLight('#fc642d', 0.8, 20, Math.PI/6, 0.9, 1);
        light3.position.set(house1.position.x + 2, 10, house1.position.z -5.5);
        light3.target.position.set(house1.position.x + 2, 0, house1.position.z - 9);
        scene.add(light3);
        scene.add(light3.target);
        model.scale.set(0.01, 0.01, 0.01);
        model.position.set(house1.position.x + 2, house1.position.y, house1.position.z - 5.5);
        model.rotateY(Math.PI/2);
        scene.add(model);
    });

    //sun
    const sphereGeometry = new THREE.SphereGeometry(15, 32, 16);
    const shpereMaterial = new THREE.MeshStandardMaterial({color: '#f4791f'});
    const sunSphere = new THREE.Mesh(sphereGeometry, shpereMaterial);
    sunSphere.position.x = city.position.x -7;
    sunSphere.position.y = city.position.y + 15;
    sunSphere.position.z = city.position.z -15;
    sunSphere.scale.set(0.05, 0.05, 0.05);
    city.add(sunSphere);
    scene.add(city);

    const overallLight = new THREE.DirectionalLight('#f4791f', 1.5);
    overallLight.position.set(-5, 10, 5);
    scene.add(overallLight);
}   

function animate() {
	requestAnimationFrame( animate );
    TWEEN.update();
    controls.update();
    
    // spotLight.position.set(camera.position.x + 10, camera.position.y + 10, camera.position.z + 10);
	renderer.render( scene, camera );
}

createCity();
animate();
