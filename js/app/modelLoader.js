// /js/app/modelLoader.js
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

const loader = new FBXLoader();

export function loadOfficeModel(app) {
  return new Promise((resolve, reject) => {
    loader.load(
      "./../resources/model/2021_Modelo_Oficina_without_light.fbx",
      (object) => {
        object.scale.set(0.0006, 0.0006, 0.0006);

        object.traverse((child) => {
          if (!child.isMesh) return;

          const oldMat = child.material;
          let baseColor = new THREE.Color(0xffffff);

          if (Array.isArray(oldMat) && oldMat[0] && oldMat[0].color) {
            baseColor.copy(oldMat[0].color);
          } else if (oldMat && oldMat.color) {
            baseColor.copy(oldMat.color);
          }

          child.material = new THREE.MeshStandardMaterial({
            color: baseColor,
            metalness: 0.0,
            roughness: 0.92,
            envMapIntensity: 0.9,
            side: THREE.FrontSide,
          });

          child.material.emissive = new THREE.Color(0x000000);
          child.castShadow = true;
          child.receiveShadow = true;
        });

        app.scene.add(object);

        const box = new THREE.Box3().setFromObject(object);
        app.modelCenter = box.getCenter(new THREE.Vector3());

        app.baseViewDir.copy(app.camera.position).sub(app.modelCenter).normalize();
        app.baseDistance = app.camera.position.distanceTo(app.modelCenter);

        resolve(object);
      },
      (xhr) => {
        if (xhr.total) {
          console.log(`Cargando modelo: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`);
        } else {
          console.log(`Cargando modelo: ${xhr.loaded} bytes`);
        }
      },
      (error) => {
        console.error("Error al cargar el modelo:", error);
        reject(error);
      }
    );
  });
}
