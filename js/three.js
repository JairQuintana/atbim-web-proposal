// /js/three.js – estable con container + resize
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MAIN_POSITION } from "./constants.js";

THREE.ColorManagement.enabled = true;

const container = document.getElementById("scene-container");
if (!container) {
  throw new Error(
    '[three.js] No existe #scene-container. Muévelo arriba del todo en <body> ANTES de cargar ./js/index.js'
  );
}

export const scene = new THREE.Scene();

// ====================== LUCES ======================
const mainLight = new THREE.DirectionalLight(0xffffff, 8.5);
mainLight.position.set(18, 25, 16);
mainLight.castShadow = true;
mainLight.shadow.mapSize.width = 2048;
mainLight.shadow.mapSize.height = 2048;
mainLight.shadow.bias = -0.0001;
scene.add(mainLight);

const extraLightForGreenZone = new THREE.DirectionalLight(0xffffff, 5.0);
extraLightForGreenZone.position.set(25, 22, 10);
scene.add(extraLightForGreenZone);

const fillLight = new THREE.DirectionalLight(0xd0e0ff, 1.1);
fillLight.position.set(-14, 16, -12);
scene.add(fillLight);

const warmLight = new THREE.PointLight(0xfff0e0, 7, 18);
warmLight.position.set(0, 5, -7);
scene.add(warmLight);

// ====================== RENDERER ======================
export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setClearColor(new THREE.Color(0x0c1118), 1);
container.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x0c1118);
scene.fog = new THREE.FogExp2(0x0c1118, 0.0009);

// ====================== CÁMARA Y CONTROLES ======================
export const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
camera.position.set(MAIN_POSITION.x, MAIN_POSITION.y, MAIN_POSITION.z);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Resize base (el refactor también escucha resize, pero esto asegura renderer/camera)
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
