// /js/app/language.js
import { translations } from "../translations.js";

export function setLanguage(lang) {
  const t = translations[lang] || translations.es;
  document.documentElement.lang = lang;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText("nav-solutions", t.navSolutions);
  setText("nav-technology", t.navTechnology);
  setText("nav-resources", t.navResources);
  setText("nav-about", t.navAbout);

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

  setText("hero-title", t.heroTitle);
  setText("hero-subtitle", t.heroSubtitle);

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

  const setHTML = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
  };

  setHTML("services-title", t.servicesTitle);
  setText("services-subtitle", t.servicesSubtitle);
  setText("services-card1-badge", t.servicesCard1Badge);
  setText("services-card1-text", t.servicesCard1Text);
  setText("services-card2-badge", t.servicesCard2Badge);
  setText("services-card2-text", t.servicesCard2Text);
  setText("services-card3-badge", t.servicesCard3Badge);
  setText("services-card3-text", t.servicesCard3Text);
  setHTML("services-footer", t.servicesFooter);

  setHTML("commands-title", t.commandsTitle);
  setText("commands-subtitle", t.commandsSubtitle);
  setText("commands-card1-badge", t.commandsCard1Badge);
  setText("commands-card1-text", t.commandsCard1Text);
  setText("commands-card2-badge", t.commandsCard2Badge);
  setText("commands-card2-text", t.commandsCard2Text);
  setText("commands-card3-badge", t.commandsCard3Badge);
  setText("commands-card3-text", t.commandsCard3Text);
  setHTML("commands-footer", t.commandsFooter);

  setHTML("integration-title", t.integrationTitle);
  setText("integration-paragraph", t.integrationParagraph);
  setText("integration-li1", t.integrationLi1);
  setText("integration-li2", t.integrationLi2);
  setText("integration-li3", t.integrationLi3);

  setText("projects-title", t.projectsTitle);
  setText("project1-overlay", t.project1Overlay);
  setText("project1-caption", t.project1Caption);
  setText("project2-overlay", t.project2Overlay);
  setText("project2-caption", t.project2Caption);
  setText("project3-overlay", t.project3Overlay);
  setText("project3-caption", t.project3Caption);

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

  setText("footer-text", t.footerText);
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
