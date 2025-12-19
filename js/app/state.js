// /js/app/state.js
import * as THREE from "three";

export function createAppState({
  camera,
  controls,
  renderer,
  scene,
  MAIN_POSITION,
}) {
  return {
    // three core
    camera,
    controls,
    renderer,
    scene,
    officeModel: null,

    // constants
    MAIN_POSITION,

    // runtime model data
    modelCenter: new THREE.Vector3(),
    baseViewDir: new THREE.Vector3(),
    baseDistance: null,

    // zones
    zoneMeshes: [],
    zoneButtons: [],
    resetButton: null,
    overlayEl: null,

    // animation
    isAnimating: false,
    isZoomed: false,
    cameraStartPosition: new THREE.Vector3(),
    targetPosition: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3(),
    animationStartTime: 0,
    animationDuration: 900,

    // input motion
    mouseX: 0,
    mouseY: 0,

    // API injection points
    panels: null, // createPanelSystem()
    cameraApi: null, // createCameraApi()
    ui: null, // injected in zoneUI
  };
}
