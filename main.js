import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresneMat.js";
const loader = new THREE.TextureLoader();

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
camera.position.z = 5;

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

new OrbitControls(camera, renderer.domElement);
const detail = 12;

const geo = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./texture/8081_earthmap10k.jpg"), // diffuse
  specularMap: loader.load("./texture/8081_earthspec10k.jpg"), // specular
  // shininess: 10,
  bumpMap: loader.load("./textures/01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geo, material);
earthGroup.add(earthMesh);

const lightMaterial = new THREE.MeshBasicMaterial({
  map: loader.load("./texture/8081_earthlights10k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo, lightMaterial);
earthGroup.add(lightsMesh);

const cloudsMaterial = new THREE.MeshStandardMaterial({
  map: loader.load("./texture/04_earthcloudmap.jpg"),
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.8,
  alphaMap: loader.load("./texture/05_earthcloudmaptrans.jpg"),
});
const cloudsMesh = new THREE.Mesh(geo, cloudsMaterial);
cloudsMesh.scale.setScalar(1.02);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMash = new THREE.Mesh(geo, fresnelMat);
glowMash.scale.setScalar(1.021);
earthGroup.add(glowMash);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

//
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const ambientLight = new THREE.AmbientLight(0x222222, 1);
scene.add(ambientLight);
//

function animate(t = 0) {
  requestAnimationFrame(animate);

  // earthMesh.rotation.x += 0.001;
  lightsMesh.rotation.y += 0.002;
  earthMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;
  cloudsMesh.rotation.y += 0.0023;
  glowMash.rotation.y += 0.002;

  renderer.render(scene, camera);
}
animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
