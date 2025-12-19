// /js/app/panelSystem.js
export function createPanelSystem() {
  let pendingPanelTimeout = null;
  let activePanel = null;

  function clearPendingPanel() {
    if (pendingPanelTimeout) {
      clearTimeout(pendingPanelTimeout);
      pendingPanelTimeout = null;
    }
  }

  function closeActivePanel() {
    clearPendingPanel();
    document.body.classList.remove("panel-open");
    document
      .querySelectorAll(".atbim-panel")
      .forEach((p) => p.classList.remove("is-active"));
    activePanel = null;
    document.documentElement.style.overflowY = "auto";
  }

  function openPanel(panelName) {
    clearPendingPanel();
    const panel = document.querySelector(
      `.atbim-panel[data-panel="${panelName}"]`
    );
    if (!panel) return;

    document
      .querySelectorAll(".atbim-panel")
      .forEach((p) => p.classList.remove("is-active"));
    document.body.classList.add("panel-open");
    panel.classList.add("is-active");
    activePanel = panelName;
    document.documentElement.style.overflowY = "hidden";
  }

  function openPanelAfterDelay(panelName, ms = 1000) {
    clearPendingPanel();
    pendingPanelTimeout = setTimeout(() => openPanel(panelName), ms);
  }

  return {
    closeActivePanel,
    openPanel,
    openPanelAfterDelay,
    get activePanel() {
      return activePanel;
    },
  };
}
