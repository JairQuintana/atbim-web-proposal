import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { BACKGROUND_COLOR, MAIN_POSITION } from "./constants.js";

THREE.ColorManagement.enabled = true;

const container = document.getElementById("scene-container");
export const scene = new THREE.Scene();

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.NoToneMapping;

const bg = new THREE.Color(BACKGROUND_COLOR).convertSRGBToLinear();
renderer.setClearColor(bg, 1);

export const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.2,
  1000
);
camera.position.set(MAIN_POSITION.x, MAIN_POSITION.y, MAIN_POSITION.z);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.keys = {
  LEFT: undefined,
  UP: undefined,
  RIGHT: undefined,
  BOTTOM: undefined,
};

controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;

controls.enableDamping = true;
controls.dampingFactor = 0.05;
