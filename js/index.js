// /js/index.js
import { camera, controls, renderer, scene } from "./three.js";
import { MAIN_POSITION } from "./constants.js";

import { createAppState } from "./app/state.js";
import { loadOfficeModel } from "./app/modelLoader.js";
import { injectZoneStyles } from "./app/zoneStyles.js";
import { mountZoneOverlay, setupZonesUI, updateZoneButtonsPosition } from "./app/zoneUI.js";

import { createPanelSystem } from "./app/panelSystem.js";
import { initLanguageSelector } from "./app/language.js";
import { initNavPanelLinks } from "./app/navPanelLinks.js";
import { initProjectsCinematic } from "./app/projectsCinematic.js";
import { mountPanelCloseButtons } from "./app/panelCloseButtons.js";

import { initInputMotion } from "./app/inputMotion.js";
import { startRenderLoop } from "./app/renderLoop.js";

// App state compartido
const app = createAppState({
  camera,
  controls,
  renderer,
  scene,
  MAIN_POSITION,
});

// Panel system (usa body classes y .atbim-panel)
app.panels = createPanelSystem();

// Idiomas + nav + cinematic + X de paneles
document.addEventListener("DOMContentLoaded", () => {
  initLanguageSelector();
  initNavPanelLinks(app);
  initProjectsCinematic();
  mountPanelCloseButtons(app.panels);
});

// Input (mouse + giroscopio)
initInputMotion(app);

// Estilos UI + overlay (siempre)
injectZoneStyles();
mountZoneOverlay(app);

// Cargar modelo y luego montar zonas
loadOfficeModel(app).then(() => {
  setupZonesUI(app);
  updateZoneButtonsPosition(app);
  console.log("OFICINA CARGADA");
});

// Loop render
startRenderLoop(app);

// Resize global
window.addEventListener("resize", () => {
  app.camera.aspect = window.innerWidth / window.innerHeight;
  app.camera.updateProjectionMatrix();
  app.renderer.setSize(window.innerWidth, window.innerHeight);
  updateZoneButtonsPosition(app);
});

// Escape / Space = cerrar panel + reset cámara
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.code === "Space") {
    app.panels.closeActivePanel();
    app.cameraApi.resetCamera(app);
    app.ui.showZonesOnly();
    app.ui.showHero();
  }
});
