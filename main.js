import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
camera.position.z = 5;

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const geo = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(geo, material);
scene.add(cube);

const hemisLight = new THREE.HemisphereLight();
scene.add(hemisLight);

function animate(t = 0) {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.001;
  cube.rotation.y += 0.002;

  renderer.render(scene, camera);
}
animate();
