// /js/app/language.js
import { translations } from "../translations.js";

export function setLanguage(lang) {
  const t = translations[lang] || translations.es;
  document.documentElement.lang = lang;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.textContent = value;
  };

  const setHTML = (id, value) => {
    const el = document.getElementById(id);
    if (el && typeof value === "string") el.innerHTML = value;
  };

  const renderList = (listId, items) => {
    const ul = document.getElementById(listId);
    if (!ul) return;
    ul.innerHTML = "";
    if (!Array.isArray(items)) return;

    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      ul.appendChild(li);
    });
  };

  // NAV
  setText("nav-solutions", t.navSolutions);
  setText("nav-technology", t.navTechnology);
  setText("nav-resources", t.navResources);
  setText("nav-about", t.navAbout);

  // Nav contact button (keeps arrow)
  const navContactBtn = document.getElementById("nav-contact-btn");
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
  setText("hero-title", t.heroTitle);

  // ✅ optional mobile subtitle support
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  if (isMobile && t.heroSubtitleMobile) setText("hero-subtitle", t.heroSubtitleMobile);
  else setText("hero-subtitle", t.heroSubtitle);

  const heroCta = document.getElementById("hero-cta");
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

  // SERVICES
  setHTML("services-title", t.servicesTitle);
  setText("services-subtitle", t.servicesSubtitle);
  setText("services-card1-badge", t.servicesCard1Badge);
  setText("services-card1-text", t.servicesCard1Text);
  setText("services-card2-badge", t.servicesCard2Badge);
  setText("services-card2-text", t.servicesCard2Text);
  setText("services-card3-badge", t.servicesCard3Badge);
  setText("services-card3-text", t.servicesCard3Text);
  setHTML("services-footer", t.servicesFooter);

  // COMMANDS (si lo usas en tu HTML real)
  setHTML("commands-title", t.commandsTitle);
  setText("commands-subtitle", t.commandsSubtitle);
  setText("commands-card1-badge", t.commandsCard1Badge);
  setText("commands-card1-text", t.commandsCard1Text);
  setText("commands-card2-badge", t.commandsCard2Badge);
  setText("commands-card2-text", t.commandsCard2Text);
  setText("commands-card3-badge", t.commandsCard3Badge);
  setText("commands-card3-text", t.commandsCard3Text);
  setHTML("commands-footer", t.commandsFooter);

  // TECHNOLOGY FLOW (Digital Twin)
  setHTML("physical-world-title", t.physicalWorldTitle);
  setText("physical-world-today", t.physicalWorldToday);

  setText("label-data-capture", t.labelDataCapture);
  setText("label-change", t.labelChange);

  setText("digital-twin-title", t.digitalTwinTitle);
  setText("digital-action-describe", t.digitalActionDescribe);
  setText("digital-action-decide", t.digitalActionDecide);

  setText("label-predict", t.labelPredict);
  setText("label-prescribe", t.labelPrescribe);

  setHTML("future-physical-world-title", t.futurePhysicalWorldTitle);
  setText("future-world-future", t.futureWorldFuture);

  // INTEGRATION (Resources title + content)
  setHTML("integration-title", t.integrationTitle);
  setText("integration-paragraph", t.integrationParagraph);
  setText("integration-li1", t.integrationLi1);
  setText("integration-li2", t.integrationLi2);
  setText("integration-li3", t.integrationLi3);

  // ✅ RESOURCES EXTRA (kicker/callout/metrics)
  setText("resources-kicker", t.resourcesKicker);
  setText("resources-callout-text", t.resourcesCallout);
  setText("resources-metric-1", t.resourcesMetric1);
  setText("resources-metric-2", t.resourcesMetric2);
  setText("resources-metric-3", t.resourcesMetric3);

  // PROJECTS
  setText("projects-title", t.projectsTitle);
  setText("project1-overlay", t.project1Overlay);
  setText("project1-caption", t.project1Caption);
  setText("project2-overlay", t.project2Overlay);
  setText("project2-caption", t.project2Caption);
  setText("project3-overlay", t.project3Overlay);
  setText("project3-caption", t.project3Caption);

  // ABOUT
  setText("about-kicker", t.aboutKicker);
  setText("about-title", t.aboutTitle);
  setText("about-subtitle", t.aboutSubtitle);

  const aboutCta = document.getElementById("about-cta");
  if (aboutCta) aboutCta.innerHTML = t.aboutCta;

  setText("about-recognition-title", t.aboutRecognitionTitle);
  setText("about-publications-title", t.aboutPublicationsTitle);

  renderList("about-recognition-list", t.aboutRecognitionList);
  renderList("about-publications-list", t.aboutPublicationsList);

  // CONTACT
  setText("contact-main-title", t.contactMainTitle);
  setText("contact-main-text", t.contactMainText);
  setText("contact-form-title", t.contactFormTitle);
  setText("contact-name-label", t.contactNameLabel);
  setText("contact-email-label", t.contactEmailLabel);
  setText("contact-message-label", t.contactMessageLabel);
  setText("contact-submit-btn", t.contactSubmitBtn);

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  if (nameInput) nameInput.placeholder = t.contactNamePlaceholder;
  if (emailInput) emailInput.placeholder = t.contactEmailPlaceholder;
  if (messageInput) messageInput.placeholder = t.contactMessagePlaceholder;

  // FOOTER
  setText("footer-text", t.footerText);

  window.dispatchEvent(
    new CustomEvent("atbim:lang-changed", { detail: { lang } })
  );
}

export function initLanguageSelector() {
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

  setLanguage("es");
}
