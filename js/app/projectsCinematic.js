// /js/app/projectsCinematic.js
export function initProjectsCinematic() {
  const stage = document.getElementById("pc-stage");
  const bg = document.getElementById("pc-bg");
  const img = document.getElementById("pc-img");
  const title = document.getElementById("pc-title");
  const desc = document.getElementById("pc-desc");
  const indexEl = document.getElementById("pc-index");
  const prev = document.getElementById("pc-prev");
  const next = document.getElementById("pc-next");
  const dotsWrap = document.getElementById("pc-dots");

  if (!stage || !bg || !img || !title || !desc || !indexEl || !prev || !next || !dotsWrap) return;

  const items = Array.from(document.querySelectorAll(".pc-item")).map((el) => {
    const imgSrc = el.dataset.img;
    const titleId = el.dataset.titleId;
    const descId = el.dataset.descId;

    const t = document.getElementById(titleId)?.textContent?.trim() || "";
    const d = document.getElementById(descId)?.textContent?.trim() || "";

    return { img: imgSrc, title: t, desc: d };
  });

  let active = 0;
  let autoplay = null;
  let hover = false;

  function buildDots() {
    dotsWrap.innerHTML = "";
    items.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pc-dot" + (i === active ? " is-active" : "");
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
    });
  }

  function setDots() {
    Array.from(dotsWrap.children).forEach((d, i) => {
      d.classList.toggle("is-active", i === active);
    });
  }

  function render() {
    const it = items[active];
    indexEl.textContent = String(active + 1).padStart(2, "0");
    bg.style.backgroundImage = `url("${it.img}")`;
    img.src = it.img;
    img.alt = it.title;
    title.textContent = it.title;
    desc.textContent = it.desc;
    setDots();
  }

  function goTo(i) {
    if (!items.length) return;
    active = (i + items.length) % items.length;

    stage.classList.add("pc-is-switching");
    stage.classList.add("pc-is-sweeping");

    setTimeout(render, 220);
    setTimeout(() => stage.classList.remove("pc-is-switching"), 520);
    setTimeout(() => stage.classList.remove("pc-is-sweeping"), 700);
  }

  function go(dir) {
    goTo(active + dir);
  }

  function start() {
    stop();
    autoplay = setInterval(() => {
      if (!hover) go(1);
    }, 3000);
  }

  function stop() {
    if (autoplay) clearInterval(autoplay);
    autoplay = null;
  }

  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    bg.style.transform = `scale(1.2) translate(${x * 18}px, ${y * 18}px)`;
  });

  stage.addEventListener("mouseenter", () => (hover = true));
  stage.addEventListener("mouseleave", () => {
    hover = false;
    bg.style.transform = "scale(1.2)";
  });

  prev.addEventListener("click", () => go(-1));
  next.addEventListener("click", () => go(1));

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });

  buildDots();
  render();
  start();
}
