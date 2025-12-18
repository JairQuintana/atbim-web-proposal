// /js/app/panelCloseButtons.js
export function mountPanelCloseButtons(panels) {
  const inners = document.querySelectorAll(".atbim-panel .atbim-panel-inner");

  inners.forEach((inner) => {
    if (inner.querySelector(".atbim-panel-x")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "atbim-panel-x";
    btn.setAttribute("aria-label", "Cerrar");
    btn.textContent = "✕";

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      panels.closeActivePanel();
    });

    inner.appendChild(btn);
  });
}
