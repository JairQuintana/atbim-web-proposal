// /js/app/cameraAnimations.js
import * as THREE from "three";

const ZONE_VIEW_CONFIG = [
  {
    distFactor: -0.18,
    heightOffset: 0.1,
    lookOffset: new THREE.Vector3(-2.8, 1.18, 0.05),
    customDirection: new THREE.Vector3(10, 0, 1.3),
  },
  {
    distFactor: 0.16,
    heightOffset: 1.1,
    lookOffset: new THREE.Vector3(-0.9, 0.12, -0.32),
    customDirection: new THREE.Vector3(-0.45, -0.35, -1.0),
  },
  {
    distFactor: 0.18,
    heightOffset: 0.55,
    lookOffset: new THREE.Vector3(0.02, 0, -0.56),
  },
  {
    distFactor: 0.5,
    heightOffset: 0.95,
    lookOffset: new THREE.Vector3(0, 0.05, 0),
    customDirection: new THREE.Vector3(-1.2, -0.6, 0.8),
  },
];

export function createCameraApi() {
  function zoomToZone(app, mesh, zoneIndex) {
    if (!mesh || app.baseDistance === null) return;

    const cfg = ZONE_VIEW_CONFIG[zoneIndex];
    if (!cfg) return;

    app.isAnimating = true;
    app.isZoomed = true;
    app.animationStartTime = performance.now();
    app.cameraStartPosition.copy(app.camera.position);

    let focusPoint;
    if (zoneIndex === 1) {
      focusPoint = mesh.position.clone();
    } else {
      focusPoint = mesh.userData.focusPoint.clone();
    }

    focusPoint.add(cfg.lookOffset || new THREE.Vector3());
    app.targetLookAt.copy(focusPoint);

    const desiredDistance = app.baseDistance * cfg.distFactor;

    const dir = cfg.customDirection
      ? cfg.customDirection.clone().normalize()
      : app.baseViewDir.clone();

    const camTarget = focusPoint.clone().add(dir.multiplyScalar(desiredDistance));
    camTarget.y += cfg.heightOffset;

    app.targetPosition.copy(camTarget);
  }

  function resetCamera(app) {
    app.isAnimating = true;
    app.isZoomed = false;
    app.animationStartTime = performance.now();
    app.cameraStartPosition.copy(app.camera.position);
    app.targetPosition.set(app.MAIN_POSITION.x, app.MAIN_POSITION.y, app.MAIN_POSITION.z);
    app.targetLookAt.copy(app.modelCenter);
  }

  return { zoomToZone, resetCamera };
}
