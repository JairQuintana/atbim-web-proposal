// /js/app/zoneUI.js
import * as THREE from "three";
import { createCameraApi } from "./cameraAnimations.js";
import { getHotspotsForWidth } from "../hotspots.js";

const ZONE_TO_PANEL = {
  0: "about",
  1: "technology",
  2: "resources",
  3: "services",
};

export function mountZoneOverlay(app) {
  if (app.overlayEl) return;
  const overlay = document.createElement("div");
  overlay.className = "atbim-zone-overlay";
  document.body.appendChild(overlay);
  app.overlayEl = overlay;

  // inyecta API de cámara si no existe
  if (!app.cameraApi) app.cameraApi = createCameraApi();

  // helpers UI (se inyecta para que index.js los use)
  app.ui = {
    hideHero() {
      document.body.classList.add("hero-is-hidden");
    },
    showHero() {
      document.body.classList.remove("hero-is-hidden");
    },
    showResetOnly() {
      app.zoneButtons.forEach((btn) => (btn.style.display = "none"));
      if (app.resetButton) {
        app.resetButton.style.display = "inline-flex";
        app.resetButton.style.opacity = "1";
        app.resetButton.style.pointerEvents = "auto";
        app.resetButton.classList.add("atbim-reset-button--visible");
      }
    },
    showZonesOnly() {
      app.zoneButtons.forEach((btn) => (btn.style.display = "inline-flex"));
      if (app.resetButton) {
        app.resetButton.classList.remove("atbim-reset-button--visible");
        app.resetButton.style.opacity = "0";
        app.resetButton.style.pointerEvents = "none";
        app.resetButton.style.display = "none";
      }
    },
  };
}

export function setupZonesUI(app) {
  if (!app.overlayEl) return;

  const radius = 0.03;
  const geometry = new THREE.SphereGeometry(radius, 16, 16);

  const initialHotspots = getHotspotsForWidth(window.innerWidth);

  app.currentHotspots = getHotspotsForWidth(window.innerWidth);

  initialHotspots.forEach((hotspot, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0,
    });

    const marker = new THREE.Mesh(geometry, material);

    const buttonOffsetX = hotspot.buttonX || 0;
    const buttonOffsetY =
      hotspot.buttonY !== undefined ? hotspot.buttonY : 0.02;
    const buttonOffsetZ = hotspot.buttonZ || 0;

    marker.position.set(
      app.modelCenter.x + buttonOffsetX,
      app.modelCenter.y + buttonOffsetY,
      app.modelCenter.z + buttonOffsetZ
    );

    marker.userData = {
      id: hotspot.id,
      zoneIndex: index,
      focusPoint: new THREE.Vector3(
        app.modelCenter.x + (hotspot.focusX || 0),
        app.modelCenter.y +
          (hotspot.focusY !== undefined ? hotspot.focusY : 0.02),
        app.modelCenter.z + (hotspot.focusZ || 0)
      ),
    };

    app.scene.add(marker);
    app.zoneMeshes.push(marker);

    const button = document.createElement("button");
    button.className = `atbim-zone-button zone-${index + 1}`;

    const dot = document.createElement("span");
    dot.className = "dot";
    const label = document.createElement("span");
    label.className = "label";
    label.textContent = hotspot.id;

    button.appendChild(dot);
    button.appendChild(label);

    button.addEventListener("click", (e) => {
      e.stopPropagation();

      app.panels?.closeActivePanel();

      button.classList.add("atbim-zone-button--active");
      setTimeout(
        () => button.classList.remove("atbim-zone-button--active"),
        250
      );

      app.cameraApi.zoomToZone(app, marker, index);
      app.ui.showResetOnly();
      app.ui.hideHero();

      const panelName = ZONE_TO_PANEL[index];
      if (panelName) app.panels?.openPanelAfterDelay(panelName, 1000);
    });

    app.overlayEl.appendChild(button);
    app.zoneButtons.push(button);
  });

  // reset button
  const resetButton = document.createElement("button");
  resetButton.className = "atbim-reset-button";
  resetButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M3.51 15a9 9 0 1 0 .49-5h-3"></path>
    </svg>
    <span>Volver a vista inicial</span>
  `;

  resetButton.addEventListener("click", (e) => {
    e.stopPropagation();
    app.panels?.closeActivePanel();
    app.cameraApi.resetCamera(app);
    app.ui.showZonesOnly();
    app.ui.showHero();
  });

  app.overlayEl.appendChild(resetButton);
  app.resetButton = resetButton;

  app.hotspotMode = getHotspotMode(window.innerWidth);
  app.ui.showZonesOnly();
  updateZoneButtonsPosition(app);
}

export function updateZoneButtonsPosition(app) {
  const container = document.getElementById("scene-container");
  if (!app.zoneMeshes.length || !container) return;

  const rect = container.getBoundingClientRect();

  app.zoneMeshes.forEach((mesh, index) => {
    const btn = app.zoneButtons[index];
    if (!btn) return;

    const vector = mesh.position.clone().project(app.camera);
    const x = rect.left + (vector.x * 0.5 + 0.5) * rect.width;
    const y = rect.top + (-vector.y * 0.5 + 0.5) * rect.height;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  });
}

function applyHotspotsToScene(app, hotspots) {
  // Reposiciona markers 3D + focusPoint (y si quieres, texto del botón)
  hotspots.forEach((hotspot, index) => {
    const mesh = app.zoneMeshes[index];
    const btn = app.zoneButtons[index];
    if (!mesh || !btn) return;

    const buttonOffsetX = hotspot.buttonX || 0;
    const buttonOffsetY =
      hotspot.buttonY !== undefined ? hotspot.buttonY : 0.02;
    const buttonOffsetZ = hotspot.buttonZ || 0;

    mesh.position.set(
      app.modelCenter.x + buttonOffsetX,
      app.modelCenter.y + buttonOffsetY,
      app.modelCenter.z + buttonOffsetZ
    );

    mesh.userData.id = hotspot.id;
    mesh.userData.focusPoint.set(
      app.modelCenter.x + (hotspot.focusX || 0),
      app.modelCenter.y +
        (hotspot.focusY !== undefined ? hotspot.focusY : 0.02),
      app.modelCenter.z + (hotspot.focusZ || 0)
    );

    // opcional: actualiza el texto del botón si cambia
    const label = btn.querySelector(".label");
    if (label) label.textContent = hotspot.id;
  });

  // importante: tras cambiar posiciones 3D, recalcula 2D
  updateZoneButtonsPosition(app);
}

function getHotspotMode(width) {
  if (width <= 768) return "lte768";
  if (width <= 1032) return "lte1032";
  return "default";
}

export function updateHotspotsForViewport(app) {
  if (!app.zoneMeshes?.length) return;

  const width = window.innerWidth;

  const nextHotspots = getHotspotsForWidth(width);
  const nextMode = getHotspotMode ? getHotspotMode(width) : null;

  // Si quieres: solo recalcular si cambia el "modo" o el array de hotspots
  // (lo típico es usar modo/breakpoint)
  const modeChanged = nextMode !== app.hotspotMode;

  if (!modeChanged) return;

  app.hotspotMode = nextMode;
  app.currentHotspots = nextHotspots;

  nextHotspots.forEach((hotspot, index) => {
    const marker = app.zoneMeshes[index];
    if (!marker) return;

    const buttonOffsetX = hotspot.buttonX || 0;
    const buttonOffsetY =
      hotspot.buttonY !== undefined ? hotspot.buttonY : 0.02;
    const buttonOffsetZ = hotspot.buttonZ || 0;

    // mover marker
    marker.position.set(
      app.modelCenter.x + buttonOffsetX,
      app.modelCenter.y + buttonOffsetY,
      app.modelCenter.z + buttonOffsetZ
    );

    // actualizar focusPoint (MUY IMPORTANTE si lo usas para zoom)
    marker.userData.focusPoint.set(
      app.modelCenter.x + (hotspot.focusX || 0),
      app.modelCenter.y +
        (hotspot.focusY !== undefined ? hotspot.focusY : 0.02),
      app.modelCenter.z + (hotspot.focusZ || 0)
    );
  });
}

export function updateModelCenter(app) {
  if (!app.officeModel) return;
  const box = new THREE.Box3().setFromObject(app.officeModel);
  app.modelCenter = box.getCenter(new THREE.Vector3());
}
