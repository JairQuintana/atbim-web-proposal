// /js/app/navPanelLinks.js
export function initNavPanelLinks(app) {
  const navMap = [
    { id: "nav-solutions", panel: "services", zoneIndex: 0 },
    { id: "nav-technology", panel: "technology", zoneIndex: 1 },
    { id: "nav-resources", panel: "resources", zoneIndex: 2 },
    { id: "nav-about", panel: "about", zoneIndex: 3 },
  ];

  navMap.forEach(({ id, panel, zoneIndex }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("click", (e) => {
      e.preventDefault();

      app.panels.closeActivePanel();

      if (app.zoneMeshes[zoneIndex]) {
        app.cameraApi.zoomToZone(app, app.zoneMeshes[zoneIndex], zoneIndex);
        app.ui.showResetOnly();
        app.ui.hideHero();
        app.panels.openPanelAfterDelay(panel, 1000);
      } else {
        app.panels.openPanel(panel);
        app.ui.showResetOnly();
        app.ui.hideHero();
      }
    });
  });

  const contactBtn = document.getElementById("nav-contact-btn");
  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();

      app.panels.closeActivePanel();
      app.cameraApi.resetCamera(app);
      app.ui.showZonesOnly();
      app.ui.showHero();

      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    });
  }
}
