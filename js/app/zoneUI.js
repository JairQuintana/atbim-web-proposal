// /js/app/zoneUI.js
import * as THREE from "three";
import { createCameraApi } from "./cameraAnimations.js";
import { getHotspotsForWidth } from "../hotspots.js";
import { translations } from "../translations.js";

const ZONE_TO_PANEL = {
  0: "about",
  1: "technology",
  2: "resources",
  3: "services",
};

function getCurrentLang() {
  return localStorage.getItem("lang") || "es";
}

function getHotspotLabelByKey(key, lang) {
  const t = translations[lang] || translations.es;

  const map = {
    about: t.hotspotAbout,
    solutions: t.hotspotSolutions,
    resources: t.hotspotResources,
    technology: t.hotspotTechnology,
  };

  return map[key] || key;
}

function setHotspotButtonLabel(buttonEl, key, lang) {
  if (!buttonEl) return;
  const label = buttonEl.querySelector(".label");
  if (!label) return;
  label.textContent = getHotspotLabelByKey(key, lang);
}

export function refreshHotspotLabels(app, lang = getCurrentLang()) {
  if (!app?.zoneButtons?.length) return;
  app.zoneButtons.forEach((btn) => {
    const key = btn?.dataset?.hotspotKey;
    if (!key) return;
    setHotspotButtonLabel(btn, key, lang);
  });
}

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

  // ✅ escuchar cambios de idioma (lo dispara language.js)
  window.addEventListener("atbim:lang-changed", (e) => {
    const lang = e?.detail?.lang || getCurrentLang();
    refreshHotspotLabels(app, lang);
    refreshResetButtonLabel(app, lang);
  });
}

export function setupZonesUI(app) {
  if (!app.overlayEl) return;

  const radius = 0.03;
  const geometry = new THREE.SphereGeometry(radius, 16, 16);

  const initialHotspots = getHotspotsForWidth(window.innerWidth);
  app.currentHotspots = initialHotspots;

  const lang = getCurrentLang();

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
      // ✅ guardamos key estable (ya no hotspot.id)
      hotspotKey: hotspot.key,
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

    // ✅ guardamos key en dataset para refrescar al cambiar idioma
    button.dataset.hotspotKey = hotspot.key;

    const dot = document.createElement("span");
    dot.className = "dot";
    const label = document.createElement("span");
    label.className = "label";

    // ✅ label traducido
    label.textContent = getHotspotLabelByKey(hotspot.key, lang);

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
  resetButton.dataset.i18nKey = "resetView";

  // ✅ contenido traducible (solo el texto, el svg se mantiene)
  resetButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="1 4 1 10 7 10"></polyline>
      <path d="M3.51 15a9 9 0 1 0 .49-5h-3"></path>
    </svg>
    <span class="reset-label"></span>
  `;

  app.overlayEl.appendChild(resetButton);
  app.resetButton = resetButton;

  // ✅ set label inicial del reset
  refreshResetButtonLabel(app, lang);

  resetButton.addEventListener("click", (e) => {
    e.stopPropagation();
    app.panels?.closeActivePanel();
    app.cameraApi.resetCamera(app);
    app.ui.showZonesOnly();
    app.ui.showHero();
  });

  app.hotspotMode = getHotspotMode(window.innerWidth);
  app.ui.showZonesOnly();
  updateZoneButtonsPosition(app);
}

function refreshResetButtonLabel(app, lang = getCurrentLang()) {
  const btn = app?.resetButton;
  if (!btn) return;

  const label = btn.querySelector(".reset-label");
  if (!label) return;

  const t = translations[lang] || translations.es;

  // Fallbacks por idioma
  const fallbackByLang = {
    es: "Volver a vista inicial",
    en: "Back to initial view",
  };

  // Prioridad:
  // 1️⃣ translations.resetView (si existe)
  // 2️⃣ fallback según idioma
  label.textContent =
    t.resetView || fallbackByLang[lang] || fallbackByLang.es;
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

function getHotspotMode(width) {
  if (width <= 768) return "lte768";
  if (width <= 1032) return "lte1032";
  return "default";
}

export function updateHotspotsForViewport(app) {
  if (!app.zoneMeshes?.length) return;

  const width = window.innerWidth;

  const nextHotspots = getHotspotsForWidth(width);
  const nextMode = getHotspotMode(width);

  const modeChanged = nextMode !== app.hotspotMode;
  if (!modeChanged) return;

  app.hotspotMode = nextMode;
  app.currentHotspots = nextHotspots;

  nextHotspots.forEach((hotspot, index) => {
    const marker = app.zoneMeshes[index];
    const btn = app.zoneButtons[index];
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

    // actualizar focusPoint
    marker.userData.focusPoint.set(
      app.modelCenter.x + (hotspot.focusX || 0),
      app.modelCenter.y +
        (hotspot.focusY !== undefined ? hotspot.focusY : 0.02),
      app.modelCenter.z + (hotspot.focusZ || 0)
    );

    // ✅ actualizar key estable en marker + botón
    marker.userData.hotspotKey = hotspot.key;
    if (btn) {
      btn.dataset.hotspotKey = hotspot.key;
      // mantener label traducido en resize
      setHotspotButtonLabel(btn, hotspot.key, getCurrentLang());
    }
  });

  // tras cambiar posiciones 3D, recalcula 2D
  updateZoneButtonsPosition(app);
}

export function updateModelCenter(app) {
  if (!app.officeModel) return;
  const box = new THREE.Box3().setFromObject(app.officeModel);
  app.modelCenter = box.getCenter(new THREE.Vector3());
}
