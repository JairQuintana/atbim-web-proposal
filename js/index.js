// index.js – Zoom independiente de la posición del botón
import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { MAIN_POSITION, MOVEMENT_RANGE } from "./constants.js";
import { camera, controls, renderer, scene } from "./three.js";
import { HOTSPOTS } from "./hotspots.js";
import { translations } from "./translations.js";

const loader = new FBXLoader();
const container = document.getElementById("scene-container");

let modelCenter = new THREE.Vector3();
let baseViewDir = new THREE.Vector3();
let baseDistance = null;

const zoneMeshes = [];
const zoneButtons = [];
let resetButton = null;

let isAnimating = false;
let isZoomed = false;
let cameraStartPosition = new THREE.Vector3();
let targetPosition = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
let animationStartTime = 0;
const animationDuration = 900;

// ==========================
//   CARGA DEL MODELO FBX
// ==========================
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

    scene.add(object);

    const box = new THREE.Box3().setFromObject(object);
    modelCenter = box.getCenter(new THREE.Vector3());

    baseViewDir.copy(camera.position).sub(modelCenter).normalize();
    baseDistance = camera.position.distanceTo(modelCenter);

    setupZonesUI();

    console.log("OFICINA CARGADA");
  },
  (xhr) => {
    console.log(
      `Cargando modelo: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`
    );
  },
  (error) => {
    console.error("Error al cargar el modelo:", error);
  }
);

// ==========================
//   UI: OVERLAY + BOTONES
// ==========================
const style = document.createElement("style");
style.textContent = `
  .atbim-zone-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 50;
  }

  .atbim-zone-button {
    position: absolute;
    transform: translate(-50%, -50%);
    pointer-events: auto;
    padding: 0.6rem 2rem;
    border-radius: 999px;
    border: 1px solid rgba(129, 140, 248, 0.9);
    background: radial-gradient(circle at top left, rgba(129,140,248,0.35), rgba(15,23,42,0.98));
    color: #e5e7eb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 600;
    cursor: pointer;
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(129,140,248,0.25), 0 10px 28px rgba(15,23,42,0.9);
    backdrop-filter: blur(10px);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    animation: atbim-pulse 1.8s ease-in-out infinite;
    transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
  }

  .atbim-zone-button::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    background: conic-gradient(from 120deg, rgba(129,140,248,0.0), rgba(129,140,248,0.7), rgba(236,72,153,0.7), rgba(129,140,248,0.0));
    opacity: 0;
    animation: atbim-glow 2.4s linear infinite;
    z-index: -1;
  }

  .atbim-zone-button span.label { position: relative; z-index: 1; }
  .atbim-zone-button span.dot {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #a5b4fc;
    box-shadow: 0 0 10px rgba(129,140,248,0.9);
    animation: atbim-blink 1.1s ease-in-out infinite;
  }

  .atbim-zone-button.zone-2 { border-color: rgba(236,72,153,0.9); box-shadow: 0 0 0 1px rgba(236,72,153,0.25), 0 10px 28px rgba(15,23,42,0.9); }
  .atbim-zone-button.zone-2 span.dot { background: #fb7185; box-shadow: 0 0 10px rgba(248,113,113,0.9); animation-delay: 0.25s; }
  .atbim-zone-button.zone-3 { border-color: rgba(45,212,191,0.9); box-shadow: 0 0 0 1px rgba(45,212,191,0.25), 0 10px 28px rgba(15,23,42,0.9); }
  .atbim-zone-button.zone-3 span.dot { background: #5eead4; box-shadow: 0 0 10px rgba(45,212,191,0.9); animation-delay: 0.5s; }

  .atbim-zone-button:hover { transform: translate(-50%, -50%) translateY(-2px); box-shadow: 0 0 0 1px rgba(129,140,248,0.4), 0 14px 34px rgba(15,23,42,1); }
  .atbim-zone-button.atbim-zone-button--active { transform: translate(-50%, -50%) scale(1.06); box-shadow: 0 0 0 1px rgba(244, 244, 245, 0.6), 0 18px 40px rgba(15,23,42,1); }

  .atbim-reset-button {
    position: absolute;
    pointer-events: auto;
    bottom: 3.5rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.55rem 1.8rem;
    border-radius: 999px;
    border: 1px solid rgba(148,163,184,0.9);
    background: radial-gradient(circle at top, rgba(15,23,42,0.98), rgba(15,23,42,0.96));
    color: #e5e7eb;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 0 0 1px rgba(148,163,184,0.35), 0 10px 28px rgba(15,23,42,0.9);
    backdrop-filter: blur(10px);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.15s ease-out, transform 0.15s ease-out;
  }

  .atbim-reset-button--visible { opacity: 1; }

  @keyframes atbim-pulse { 0%, 100% { opacity: 0.96; } 50% { opacity: 1; } }
  @keyframes atbim-glow { 0% { opacity: 0; transform: rotate(0deg); } 35% { opacity: 1; } 70% { opacity: 0; transform: rotate(180deg); } 100% { opacity: 0; transform: rotate(360deg); } }
  @keyframes atbim-blink { 0%, 100% { opacity: 0.3; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.25); } }
`;
document.head.appendChild(style);

const overlay = document.createElement("div");
overlay.className = "atbim-zone-overlay";
document.body.appendChild(overlay);

// ==========================
//   CREAR ZONAS + BOTÓN RESET
// ==========================
function setupZonesUI() {
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
    const buttonOffsetY =
      hotspot.buttonY !== undefined ? hotspot.buttonY : 0.02;
    const buttonOffsetZ = hotspot.buttonZ || 0;

    marker.position.set(
      modelCenter.x + buttonOffsetX,
      modelCenter.y + buttonOffsetY,
      modelCenter.z + buttonOffsetZ
    );

    marker.userData = {
      id: hotspot.id,
      zoneIndex: index,
      focusPoint: new THREE.Vector3(
        modelCenter.x + (hotspot.focusX || 0),
        modelCenter.y + (hotspot.focusY !== undefined ? hotspot.focusY : 0.02),
        modelCenter.z + (hotspot.focusZ || 0)
      ),
    };

    scene.add(marker);
    zoneMeshes.push(marker);

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
      button.classList.add("atbim-zone-button--active");
      setTimeout(
        () => button.classList.remove("atbim-zone-button--active"),
        250
      );
      zoomToZone(marker, index);
      showResetOnly();
      hideHero();

    });

    overlay.appendChild(button);
    zoneButtons.push(button);
  });

  resetButton = document.createElement("button");
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
    resetCamera();
    showZonesOnly();
    showHero();
  });
  overlay.appendChild(resetButton);

  showZonesOnly();
  updateZoneButtonsPosition();
}

function showResetOnly() {
  zoneButtons.forEach((btn) => (btn.style.display = "none"));

  if (resetButton) {
    resetButton.style.display = "inline-flex";
    resetButton.style.opacity = "1";
    resetButton.style.pointerEvents = "auto";
    resetButton.classList.add("atbim-reset-button--visible");
  }
}

function showZonesOnly() {
  zoneButtons.forEach((btn) => (btn.style.display = "inline-flex"));

  if (resetButton) {
    resetButton.classList.remove("atbim-reset-button--visible");
    resetButton.style.opacity = "0";
    resetButton.style.pointerEvents = "none";
    resetButton.style.display = "none";
  }
}

function updateZoneButtonsPosition() {
  if (!zoneMeshes.length || !container) return;
  const rect = container.getBoundingClientRect();
  zoneMeshes.forEach((mesh, index) => {
    const btn = zoneButtons[index];
    if (!btn) return;
    const vector = mesh.position.clone().project(camera);
    const x = rect.left + (vector.x * 0.5 + 0.5) * rect.width;
    const y = rect.top + (-vector.y * 0.5 + 0.5) * rect.height;
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  });
}

// ==========================
//   ZOOM Y RESET
// ==========================

// 🔧 CONFIG DE VISTA POR ZONA
const ZONE_VIEW_CONFIG = [
  {
    distFactor: -0.18,
    heightOffset: 0.1,
    lookOffset: new THREE.Vector3(-2.8, 1.18, 0.05),
    customDirection: new THREE.Vector3(10, 0, 1.3),
  },
  {
    // ZONA 2 Resources
    distFactor: 0.16,
    heightOffset: 1.1,
    lookOffset: new THREE.Vector3(-0.9, 0.12, -0.32),
    customDirection: new THREE.Vector3(-0.45, -0.35, -1.0),
  },
  {
    // ZONA 3 About Us
    distFactor: 0.18,
    heightOffset: 0.55,
    lookOffset: new THREE.Vector3(0.02, 0, -0.56),
  },
  {
    // ZONA 4 Technology
    distFactor: 0.5,
    heightOffset: 0.95,
    lookOffset: new THREE.Vector3(0, 0.05, 0),
    customDirection: new THREE.Vector3(-1.2, -0.6, 0.8),
  },
];

function zoomToZone(mesh, zoneIndex) {
  if (!mesh || baseDistance === null) return;
  console.log("ZOOM A ZONA", HOTSPOTS[zoneIndex].id);

  const cfg = ZONE_VIEW_CONFIG[zoneIndex];
  if (!cfg) {
    console.warn(`No hay configuración para la zona ${zoneIndex + 1}`);
    return;
  }

  isAnimating = true;
  isZoomed = true;
  animationStartTime = performance.now();
  cameraStartPosition.copy(camera.position);

  let focusPoint;
  if (zoneIndex === 1) {
    // ZONA 2: usamos EXACTAMENTE la posición del marker
    focusPoint = mesh.position.clone();
  } else {
    focusPoint = mesh.userData.focusPoint.clone();
  }

  focusPoint.add(cfg.lookOffset || new THREE.Vector3());
  targetLookAt.copy(focusPoint);

  const desiredDistance = baseDistance * cfg.distFactor;

  let dir;
  if (cfg.customDirection) {
    dir = cfg.customDirection.clone().normalize();
  } else {
    dir = baseViewDir.clone();
  }

  const camTarget = focusPoint.clone().add(dir.multiplyScalar(desiredDistance));
  camTarget.y += cfg.heightOffset;
  targetPosition.copy(camTarget);
}

function resetCamera() {
  isAnimating = true;
  isZoomed = false;
  animationStartTime = performance.now();
  cameraStartPosition.copy(camera.position);
  targetPosition.set(MAIN_POSITION.x, MAIN_POSITION.y, MAIN_POSITION.z);
  targetLookAt.copy(modelCenter);
}

// ==========================
//   MOVIMIENTO SUAVE + LOOP
// ==========================
let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
});

if (window.DeviceOrientationEvent) {
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
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;
    mouseX = Math.max(-1, Math.min(1, gamma / 30));
    mouseY = Math.max(-1, Math.min(1, beta / 30));
  });
}

function animate() {
  requestAnimationFrame(animate);

  if (isAnimating) {
    const elapsed = performance.now() - animationStartTime;
    const t = Math.min(elapsed / animationDuration, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.lerpVectors(cameraStartPosition, targetPosition, eased);
    camera.lookAt(targetLookAt);
    if (t >= 1) isAnimating = false;
  } else if (!isZoomed) {
    camera.position.x = MAIN_POSITION.x + mouseX * -MOVEMENT_RANGE.x;
    camera.position.y = MAIN_POSITION.y + mouseY * MOVEMENT_RANGE.y;
    camera.position.z = MAIN_POSITION.z;
    camera.lookAt(modelCenter);
  } else {
    camera.lookAt(targetLookAt);
  }

  controls.update();
  renderer.render(scene, camera);
  updateZoneButtonsPosition();
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateZoneButtonsPosition();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" || e.code === "Space") {
    resetCamera();
    showZonesOnly();
    showHero();

  }
});

function setLanguage(lang) {
  const t = translations[lang] || translations.es;

  // Cambiar atributo lang del <html>
  document.documentElement.lang = lang;

  // NAV
  const navSolutions = document.getElementById("nav-solutions");
  const navTechnology = document.getElementById("nav-technology");
  const navResources = document.getElementById("nav-resources");
  const navAbout = document.getElementById("nav-about");
  const navContactBtn = document.getElementById("nav-contact-btn");

  if (navSolutions) navSolutions.textContent = t.navSolutions;
  if (navTechnology) navTechnology.textContent = t.navTechnology;
  if (navResources) navResources.textContent = t.navResources;
  if (navAbout) navAbout.textContent = t.navAbout;
  if (navContactBtn) {
    const arrowSpan = navContactBtn.querySelector(".arrow");
    navContactBtn.childNodes[0].textContent = t.navContactBtn + " ";
    if (!arrowSpan) {
      const span = document.createElement("span");
      span.className = "arrow";
      span.textContent = "→";
      navContactBtn.appendChild(span);
    }
  }

  // HERO
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  const heroCta = document.getElementById("hero-cta");

  if (heroTitle) heroTitle.textContent = t.heroTitle;
  if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
  if (heroCta) {
    const arrowSpan = heroCta.querySelector(".arrow");
    heroCta.childNodes[0].textContent = t.heroCta + " ";
    if (!arrowSpan) {
      const span = document.createElement("span");
      span.className = "arrow";
      span.textContent = "→";
      heroCta.appendChild(span);
    }
  }

  // SERVICIOS
  const servicesTitle = document.getElementById("services-title");
  const servicesSubtitle = document.getElementById("services-subtitle");
  const servicesCard1Badge = document.getElementById("services-card1-badge");
  const servicesCard1Text = document.getElementById("services-card1-text");
  const servicesCard2Badge = document.getElementById("services-card2-badge");
  const servicesCard2Text = document.getElementById("services-card2-text");
  const servicesCard3Badge = document.getElementById("services-card3-badge");
  const servicesCard3Text = document.getElementById("services-card3-text");
  const servicesFooter = document.getElementById("services-footer");

  if (servicesTitle) servicesTitle.innerHTML = t.servicesTitle;
  if (servicesSubtitle) servicesSubtitle.textContent = t.servicesSubtitle;
  if (servicesCard1Badge) servicesCard1Badge.textContent = t.servicesCard1Badge;
  if (servicesCard1Text) servicesCard1Text.textContent = t.servicesCard1Text;
  if (servicesCard2Badge) servicesCard2Badge.textContent = t.servicesCard2Badge;
  if (servicesCard2Text) servicesCard2Text.textContent = t.servicesCard2Text;
  if (servicesCard3Badge) servicesCard3Badge.textContent = t.servicesCard3Badge;
  if (servicesCard3Text) servicesCard3Text.textContent = t.servicesCard3Text;
  if (servicesFooter) servicesFooter.innerHTML = t.servicesFooter;

  // COMANDOS
  const commandsTitle = document.getElementById("commands-title");
  const commandsSubtitle = document.getElementById("commands-subtitle");
  const commandsCard1Badge = document.getElementById("commands-card1-badge");
  const commandsCard1Text = document.getElementById("commands-card1-text");
  const commandsCard2Badge = document.getElementById("commands-card2-badge");
  const commandsCard2Text = document.getElementById("commands-card2-text");
  const commandsCard3Badge = document.getElementById("commands-card3-badge");
  const commandsCard3Text = document.getElementById("commands-card3-text");
  const commandsFooter = document.getElementById("commands-footer");

  if (commandsTitle) commandsTitle.innerHTML = t.commandsTitle;
  if (commandsSubtitle) commandsSubtitle.textContent = t.commandsSubtitle;
  if (commandsCard1Badge) commandsCard1Badge.textContent = t.commandsCard1Badge;
  if (commandsCard1Text) commandsCard1Text.textContent = t.commandsCard1Text;
  if (commandsCard2Badge) commandsCard2Badge.textContent = t.commandsCard2Badge;
  if (commandsCard2Text) commandsCard2Text.textContent = t.commandsCard2Text;
  if (commandsCard3Badge) commandsCard3Badge.textContent = t.commandsCard3Badge;
  if (commandsCard3Text) commandsCard3Text.textContent = t.commandsCard3Text;
  if (commandsFooter) commandsFooter.innerHTML = t.commandsFooter;

  // INTEGRACIÓN IA
  const integrationTitle = document.getElementById("integration-title");
  const integrationParagraph = document.getElementById("integration-paragraph");
  const integrationLi1 = document.getElementById("integration-li1");
  const integrationLi2 = document.getElementById("integration-li2");
  const integrationLi3 = document.getElementById("integration-li3");

  if (integrationTitle) integrationTitle.innerHTML = t.integrationTitle;
  if (integrationParagraph)
    integrationParagraph.textContent = t.integrationParagraph;
  if (integrationLi1) integrationLi1.textContent = t.integrationLi1;
  if (integrationLi2) integrationLi2.textContent = t.integrationLi2;
  if (integrationLi3) integrationLi3.textContent = t.integrationLi3;

  // PROYECTOS
  const projectsTitle = document.getElementById("projects-title");
  const project1Overlay = document.getElementById("project1-overlay");
  const project1Caption = document.getElementById("project1-caption");
  const project2Overlay = document.getElementById("project2-overlay");
  const project2Caption = document.getElementById("project2-caption");
  const project3Overlay = document.getElementById("project3-overlay");
  const project3Caption = document.getElementById("project3-caption");

  if (projectsTitle) projectsTitle.textContent = t.projectsTitle;
  if (project1Overlay) project1Overlay.textContent = t.project1Overlay;
  if (project1Caption) project1Caption.textContent = t.project1Caption;
  if (project2Overlay) project2Overlay.textContent = t.project2Overlay;
  if (project2Caption) project2Caption.textContent = t.project2Caption;
  if (project3Overlay) project3Overlay.textContent = t.project3Overlay;
  if (project3Caption) project3Caption.textContent = t.project3Caption;

  // CONTACTO
  const contactMainTitle = document.getElementById("contact-main-title");
  const contactMainText = document.getElementById("contact-main-text");
  const contactFormTitle = document.getElementById("contact-form-title");
  const contactNameLabel = document.getElementById("contact-name-label");
  const contactEmailLabel = document.getElementById("contact-email-label");
  const contactMessageLabel = document.getElementById("contact-message-label");
  const contactSubmitBtn = document.getElementById("contact-submit-btn");

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  if (contactMainTitle) contactMainTitle.textContent = t.contactMainTitle;
  if (contactMainText) contactMainText.textContent = t.contactMainText;
  if (contactFormTitle) contactFormTitle.textContent = t.contactFormTitle;
  if (contactNameLabel) contactNameLabel.textContent = t.contactNameLabel;
  if (contactEmailLabel) contactEmailLabel.textContent = t.contactEmailLabel;
  if (contactMessageLabel)
    contactMessageLabel.textContent = t.contactMessageLabel;
  if (contactSubmitBtn) contactSubmitBtn.textContent = t.contactSubmitBtn;

  if (nameInput) nameInput.placeholder = t.contactNamePlaceholder;
  if (emailInput) emailInput.placeholder = t.contactEmailPlaceholder;
  if (messageInput) messageInput.placeholder = t.contactMessagePlaceholder;

  // FOOTER
  const footerText = document.getElementById("footer-text");
  if (footerText) footerText.textContent = t.footerText;
}

// ==============================
// GESTIÓN BOTONES ES / EN
// ==============================

function initLanguageSelector() {
  const langButtons = document.querySelectorAll(".lang-btn");
  if (!langButtons.length) return;

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;

      setLanguage(lang);

      langButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Idioma por defecto
  setLanguage("es");
}

document.addEventListener("DOMContentLoaded", initLanguageSelector);

function hideHero() {
  document.body.classList.add("hero-is-hidden");
}

function showHero() {
  document.body.classList.remove("hero-is-hidden");
}


