// /js/app/zoneUI.js
import * as THREE from "three";
import { HOTSPOTS } from "../hotspots.js";
import { createCameraApi } from "./cameraAnimations.js";

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

  HOTSPOTS.forEach((hotspot, index) => {
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0,
    });

    const marker = new THREE.Mesh(geometry, material);

    const buttonOffsetX = hotspot.buttonX || 0;
    const buttonOffsetY = hotspot.buttonY !== undefined ? hotspot.buttonY : 0.02;
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
        app.modelCenter.y + (hotspot.focusY !== undefined ? hotspot.focusY : 0.02),
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
      setTimeout(() => button.classList.remove("atbim-zone-button--active"), 250);

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
