import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { MAIN_POSITION, MOVEMENT_RANGE } from "./constants.js";
import { camera, controls, renderer, scene } from "./three.js";

const loader = new FBXLoader();
loader.load(
  "./../resources/model/2021_Modelo_Oficina.fbx",
  (object) => {
    object.scale.set(0.01, 0.01, 0.01);
    scene.add(object);
  },
  (xhr) =>
    console.log(`Cargando: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`),
  (error) => console.error("Error al cargar el modelo:", error)
);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let mouseX = 0;
let mouseY = 0;

// ---- Desktop: movimiento con ratón ----
window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

// ---- Móvil: movimiento con inclinación ----
if (window.DeviceOrientationEvent) {
  // En iPhone hay que pedir permiso
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    window.addEventListener("click", async () => {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === "granted") startOrientation();
    });
  } else {
    startOrientation();
  }
}

function startOrientation() {
  window.addEventListener("deviceorientation", (e) => {
    const gamma = e.gamma || 0; // izquierda-derecha
    const beta = e.beta || 0; // adelante-atrás
    // normalizamos a -1..1 (máximo 30 grados)
    mouseX = Math.max(-1, Math.min(1, gamma / 30));
    mouseY = Math.max(-1, Math.min(1, beta / 30));
  });
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  camera.position.x = MAIN_POSITION.x + mouseX * -MOVEMENT_RANGE.x;
  camera.position.y = MAIN_POSITION.y + mouseY * MOVEMENT_RANGE.y;
  camera.position.z = MAIN_POSITION.z;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}
animate();
