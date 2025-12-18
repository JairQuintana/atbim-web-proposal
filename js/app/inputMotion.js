// /js/app/inputMotion.js
export function initInputMotion(app) {
  window.addEventListener("mousemove", (event) => {
    app.mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    app.mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === "function") {
      window.addEventListener("click", async () => {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") startOrientation(app);
      });
    } else {
      startOrientation(app);
    }
  }
}

function startOrientation(app) {
  window.addEventListener("deviceorientation", (e) => {
    const gamma = e.gamma || 0;
    const beta = e.beta || 0;
    app.mouseX = Math.max(-1, Math.min(1, gamma / 30));
    app.mouseY = Math.max(-1, Math.min(1, beta / 30));
  });
}
