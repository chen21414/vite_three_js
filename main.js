import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//requirement, 1. scene/ 2. camera/ 3. renderer

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
); //field of view, aspect ratio, view frustum (0.1 to 1000 can see everything from camera lens)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30); //move camera along z axis
camera.position.setX(-3);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff6347,
//   wireframe: true,
// });
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  //wireframe: true, //to turn on wireframe
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);
//1. geometry: the {x,y,z} points that makeup a shape
//2. material: wrapping paper for geometry
//3. mesh: geometry + material

const pointLight = new THREE.PointLight(0xffffff); //0x is hexical literial
pointLight.position.set(5, 5, 5); //moving away from center; setting position

const ambientLight = new THREE.AmbientLight(0xffffff); //ambient like a fog light in the room
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement); //listen dom element of mouse and update it accordingly

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25); // each sphere has radius of 0.25
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  //filling an array with 3 values, map each value to randome float spread function
  //randomly generate a number from -100 to 100
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

//array of 200 values, call each value to addStar function
Array(200).fill().forEach(addStar);

//Background
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

//Avatar
const jeffTexture = new THREE.TextureLoader().load("jeff.png");

const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);

scene.add(jeff);

//Moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

//calling render method automatically using recursive
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update(); //to make sure changes is reflectly

  renderer.render(scene, camera); //game loop
}

animate();
