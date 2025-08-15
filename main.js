import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
const loader = new THREE.TextureLoader();

const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
camera.position.z = 5;

renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const geo = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
  map: loader.load("./texture/earthmap1k.jpg"),
});
const earthMesh = new THREE.Mesh(geo, material);
scene.add(earthMesh);

const hemisLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemisLight);

function animate(t = 0) {
  requestAnimationFrame(animate);

  // earthMesh.rotation.x += 0.001;
  earthMesh.rotation.y += 0.001;

  renderer.render(scene, camera);
}
animate();
