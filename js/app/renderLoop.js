// /js/app/renderLoop.js
import { MOVEMENT_RANGE } from "../constants.js";
import { updateZoneButtonsPosition } from "./zoneUI.js";

export function startRenderLoop(app) {
  function animate() {
    requestAnimationFrame(animate);

    if (app.isAnimating) {
      const elapsed = performance.now() - app.animationStartTime;
      const t = Math.min(elapsed / app.animationDuration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      app.camera.position.lerpVectors(app.cameraStartPosition, app.targetPosition, eased);
      app.camera.lookAt(app.targetLookAt);

      if (t >= 1) app.isAnimating = false;
    } else if (!app.isZoomed) {
      app.camera.position.x = app.MAIN_POSITION.x + app.mouseX * -MOVEMENT_RANGE.x;
      app.camera.position.y = app.MAIN_POSITION.y + app.mouseY * MOVEMENT_RANGE.y;
      app.camera.position.z = app.MAIN_POSITION.z;
      app.camera.lookAt(app.modelCenter);
    } else {
      app.camera.lookAt(app.targetLookAt);
    }

    app.controls.update();
    app.renderer.render(app.scene, app.camera);
    updateZoneButtonsPosition(app);
  }

  animate();
}
