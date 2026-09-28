(function () {
  const CONFIG = window.VERTEX_CONFIG;
  const PHONE_PATTERN = /^(?:\+?91[\s-]?)?[6-9]\d{9}$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MEGA_CLOSE_DELAY_MS = 150;

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function initHeader() {
    const nav = document.getElementById("site-nav");
    const backToTop = document.querySelector("[data-back-to-top]");

    const onScroll = () => {
      const isScrolled = window.scrollY > 12;
      if (nav) nav.dataset.scrolled = String(isScrolled);
      if (backToTop) backToTop.dataset.visible = String(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initMegaMenus() {
    const menus = [...document.querySelectorAll("[data-mega-trigger]")].map((trigger) => {
      const item = trigger.closest("li");
      return { trigger, item, panel: item.querySelector("[data-mega-panel]") };
    });
    if (!menus.length) return;

    let closeTimer;
    const isMenuOpen = (menu) => menu.panel.dataset.open === "true";
    const setMenuOpen = (menu, isOpen) => {
      menu.panel.dataset.open = String(isOpen);
      menu.trigger.setAttribute("aria-expanded", String(isOpen));
    };
    const openMenu = (menu) => {
      clearTimeout(closeTimer);
      menus.forEach((other) => setMenuOpen(other, other === menu));
    };
    const closeAll = () => {
      clearTimeout(closeTimer);
      menus.forEach((menu) => setMenuOpen(menu, false));
    };

    menus.forEach((menu) => {
      const { trigger, item, panel } = menu;

      item.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") openMenu(menu);
      });
      item.addEventListener("pointerleave", (event) => {
        if (event.pointerType !== "mouse") return;
        clearTimeout(closeTimer);
        closeTimer = setTimeout(closeAll, MEGA_CLOSE_DELAY_MS);
      });

      // Touch screens have no hover, so the first tap opens the menu and a second tap follows the link
      trigger.addEventListener("click", (event) => {
        if (isMenuOpen(menu)) return;
        event.preventDefault();
        openMenu(menu);
      });

      item.addEventListener("focusin", (event) => {
        if (event.target.matches(":focus-visible")) openMenu(menu);
      });
      item.addEventListener("focusout", (event) => {
        if (!item.contains(event.relatedTarget)) setMenuOpen(menu, false);
      });
      item.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !isMenuOpen(menu)) return;
        trigger.focus();
        closeAll();
      });

      // Same-page links such as services.html#slug don't navigate, so the panel has to close itself
      panel.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeAll();
      });
    });

    document.addEventListener("click", (event) => {
      if (!menus.some((menu) => menu.item.contains(event.target))) closeAll();
    });
  }
  function initDrawer() {
    const drawer = document.getElementById("mobile-drawer");
    const openButton = document.querySelector("[data-drawer-open]");
    if (!drawer || !openButton) return;

    const setOpen = (isOpen) => {
      drawer.classList.toggle("is-open", isOpen);
      drawer.setAttribute("aria-hidden", String(!isOpen));
      openButton.setAttribute("aria-expanded", String(isOpen));
      document.documentElement.classList.toggle("overflow-hidden", isOpen);
    };

    openButton.addEventListener("click", () => setOpen(true));
    drawer.querySelectorAll("[data-drawer-close], [data-drawer-link], details a").forEach((el) => {
      el.addEventListener("click", () => setOpen(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });
  }

  function initReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initCounters() {
    const counters = document.querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
      const items = accordion.querySelectorAll("[data-accordion-item]");
      items.forEach((item) => {
        const button = item.querySelector("button");
        const panel = item.querySelector("[data-accordion-panel]");
        button.addEventListener("click", () => {
          const isOpen = item.dataset.open === "true";
          items.forEach((other) => {
            other.dataset.open = "false";
            other.querySelector("button").setAttribute("aria-expanded", "false");
            other.querySelector("[data-accordion-panel]").style.gridTemplateRows = "0fr";
          });
          if (isOpen) return;
          item.dataset.open = "true";
          button.setAttribute("aria-expanded", "true");
          panel.style.gridTemplateRows = "1fr";
        });
        if (item.dataset.open === "true") panel.style.gridTemplateRows = "1fr";
      });
    });
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-group]").forEach((group) => {
      const buttons = group.querySelectorAll("[data-filter]");
      const scope = document.querySelector(group.dataset.filterGroup);
      if (!scope) return;
      const cards = scope.querySelectorAll("[data-category]");

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          const filter = button.dataset.filter;
          buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
          cards.forEach((card) => {
            const isMatch = filter === "all" || card.dataset.category.split(" ").includes(filter);
            card.hidden = !isMatch;
          });
        });
      });
    });
  }

  function setFieldError(field, message) {
    const error = field.parentElement.querySelector(".field-error");
    field.setAttribute("aria-invalid", String(Boolean(message)));
    field.classList.toggle("border-red-400", Boolean(message));
    if (!error) return;
    error.textContent = message || "";
    error.classList.toggle("hidden", !message);
  }

  function validateField(field) {
    const value = field.value.trim();
    if (field.required && !value) return "This field is required";
    if (!value) return "";
    if (field.type === "email" && !EMAIL_PATTERN.test(value)) return "Enter a valid email address";
    if (field.type === "tel" && !PHONE_PATTERN.test(value.replace(/\s/g, ""))) return "Enter a valid 10-digit mobile number";
    return "";
  }

  function buildWhatsappMessage(intro, data) {
    const lines = [intro, ""];
    Object.entries(data).forEach(([key, value]) => {
      if (value) lines.push(`${key}: ${value}`);
    });
    return lines.join("\n");
  }

  async function submitEnquiry(form, data) {
    if (!CONFIG.FORM_ENDPOINT) {
      const intro = form.dataset.intro || "Hi Vertex Certification, I'd like a free consultation.";
      window.open(window.VertexLayout.whatsappUrl(buildWhatsappMessage(intro, data)), "_blank", "noopener");
      return;
    }
    const response = await fetch(CONFIG.FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Enquiry failed with status ${response.status}`);
  }

  function initForms() {
    const params = new URLSearchParams(window.location.search);
    const presetService = params.get("service");

    document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
      const fields = form.querySelectorAll("input:not([type=hidden]), select, textarea");
      const status = form.querySelector("[data-form-status]");
      const submitButton = form.querySelector("[type=submit]");

      if (presetService) {
        const select = form.querySelector("select[name='Service']");
        const match = select && [...select.options].find((o) => o.value.toLowerCase().includes(presetService.toLowerCase()));
        if (match) select.value = match.value;
      }

      fields.forEach((field) => {
        field.addEventListener("blur", () => setFieldError(field, validateField(field)));
        field.addEventListener("input", () => {
          if (field.getAttribute("aria-invalid") === "true") setFieldError(field, validateField(field));
        });
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        let firstInvalid = null;
        fields.forEach((field) => {
          const message = validateField(field);
          setFieldError(field, message);
          if (message && !firstInvalid) firstInvalid = field;
        });
        if (firstInvalid) {
          firstInvalid.focus();
          return;
        }

        const data = Object.fromEntries(new FormData(form).entries());
        const originalLabel = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
          await submitEnquiry(form, { ...data, "Form": form.dataset.formName || "Enquiry" });
          form.reset();
          if (status) {
            status.className = "rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200";
            status.textContent = CONFIG.FORM_ENDPOINT
              ? "Thank you! A Vertex advisor will contact you within 24 hours."
              : "Thanks! We've opened WhatsApp with your details. Just hit send and our team will reply shortly.";
          }
        } catch (error) {
          console.error(error);
          if (status) {
            status.className = "rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200";
            status.textContent = `Something went wrong. Please call us on ${CONFIG.PHONE_DISPLAY}.`;
          }
        } finally {
          submitButton.disabled = false;
          submitButton.innerHTML = originalLabel;
          refreshIcons();
        }
      });
    });
  }

  // Keeps contact details in page HTML in sync with config.js
  function initConfigBindings() {
    document.querySelectorAll("[data-bind]").forEach((el) => {
      const value = CONFIG[el.dataset.bind];
      if (typeof value === "string") el.textContent = value;
    });
    document.querySelectorAll("[data-bind-href]").forEach((el) => {
      const [key, prefix = ""] = el.dataset.bindHref.split("|");
      const value = CONFIG[key];
      if (typeof value === "string") el.setAttribute("href", prefix + value);
    });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  window.VertexLayout.render();
  refreshIcons();
  initHeader();
  initMegaMenus();
  initDrawer();
  initReveal();
  initCounters();
  initAccordions();
  initFilters();
  initForms();
  initConfigBindings();
  initYear();
})();
