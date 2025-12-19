// /js/app/zoneStyles.js
export function injectZoneStyles() {
  if (document.getElementById("atbim-zone-styles")) return;

  const style = document.createElement("style");
  style.id = "atbim-zone-styles";
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
  box-shadow: 0 0 0 1px rgba(129,140,248,0.25), 0 10px 28px rgba(15,23,42,0.9);
  backdrop-filter: blur(10px);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  animation: atbim-pulse 1.8s ease-in-out infinite;
  transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
}



@media (max-width: 768px) {
.atbim-zone-button{
  padding: 0.5rem 0.5rem;
  }
  .atbim-zone-button .label {
    display: none;
  }
  .zone-1::after {
    content: "";
    position: absolute;
    height: 15dvh;
    top: -15dvh;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }
  .zone-1::before {
    line-height: 0;
    content: "Sobre Nosotros";
    font-size: 0.95rem;
    white-space: nowrap;
    position: absolute;
    width: 20dvw;
    height: 1px;
    top: -15dvh;
    right: 50%;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }
  .zone-3::after {
    content: "";
    position: absolute;
    height: 10dvh;
    top: -10dvh;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }

  .zone-3::before {
    font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
    content: "Recursos";
    font-size: 0.95rem;
    white-space: nowrap;
    position: absolute;
    width: 20dvw;
    height: 1px;
    top: -10dvh;
    right: 50%;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }
  .zone-2::after {
    content: "";
    position: absolute;
    height: 30dvh;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }
  .zone-2::before {
    line-height: 3;
    font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
    content: "Soluciones";
    position: absolute;
    font-size: 0.95rem;
    white-space: nowrap;
    width: 20dvw;
    height: 1px;
    top: calc(100% + 30dvh);
    left: 50%;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }

  .zone-4::after {
    content: "";
    position: absolute;
    height: 20dvh;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }


  .zone-4::before {
    line-height: 3;
    font-family: "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
    content: "Tecnnología";
    font-size: 0.95rem;
    white-space: nowrap;
    position: absolute;
    width: 20dvw;
    height: 1px;
    top: calc(100% + 20dvh);
    left: 50%;
    background: linear-gradient(90deg, #6a5af9, #f093fb);
    z-index: 999999;
  }
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
}
