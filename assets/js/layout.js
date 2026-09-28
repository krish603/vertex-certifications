(function () {
  const CONFIG = window.VERTEX_CONFIG;

  const BRAND_ICONS = {
    linkedin:
      '<path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/>',
    facebook:
      '<path fill="currentColor" d="M9.1 23.69v-7.98H6.63v-3.67H9.1v-1.58c0-4.09 1.85-5.98 5.86-5.98.4 0 .96.04 1.47.1.4.05.8.11 1.14.2v3.32l-.65-.03c-.24-.01-.49-.01-.73-.01-.71 0-1.26.1-1.68.31-.28.14-.51.36-.68.62-.26.42-.37 1-.37 1.75v1.3h3.92l-.39 2.1-.29 1.56h-3.24v8.25C19.4 23.24 24 18.18 24 12.04 24 5.42 18.63.04 12 .04S0 5.42 0 12.04c0 5.63 3.87 10.35 9.1 11.65z"/>',
    youtube:
      '<path fill="currentColor" d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.87.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>',
    instagram:
      '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor"/>',
    whatsapp:
      '<path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.22-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41z"/>',
  };

  function brandIcon(name, className) {
    return `<svg viewBox="0 0 24 24" class="${className}" aria-hidden="true">${BRAND_ICONS[name]}</svg>`;
  }

  function itemHref(isService, slug) {
    return isService ? `services.html#${slug}` : `schemes/${slug}.html`;
  }

  // Pages in sub-folders set data-root="../" so the shared relative links still resolve
  function withRoot(html, root) {
    const template = document.createElement("template");
    template.innerHTML = html;
    if (!root) return template.content;
    template.content.querySelectorAll("a[href], img[src]").forEach((el) => {
      const attr = el.tagName === "IMG" ? "src" : "href";
      const value = el.getAttribute(attr);
      if (/^(https?:|mailto:|tel:|#|\/)/.test(value)) return;
      el.setAttribute(attr, root + value);
    });
    return template.content;
  }

  function whatsappUrl(message) {
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message || CONFIG.WHATSAPP_GREETING)}`;
  }

  // On the contact page a link to contact.html would only reload it, so point at the form instead
  function enquiryHref(currentPage) {
    return currentPage === "contact" ? "#enquiry" : "contact.html#enquiry";
  }

  function logo({ isDark = false, className = "h-12 sm:h-14" } = {}) {
    const image = isDark ? CONFIG.LOGO_LIGHT : CONFIG.LOGO;
    return `
      <a href="index.html" class="flex shrink-0 items-center" aria-label="${CONFIG.SITE_NAME} home">
        <img src="${image.src}" alt="" width="${image.width}" height="${image.height}" class="w-auto ${className}" />
      </a>`;
  }

  function renderTopbar() {
    const items = [...CONFIG.UPDATES, ...CONFIG.UPDATES]
      .map((item) => `<span class="inline-flex items-center gap-2 px-5"><span class="size-1.5 rounded-full bg-accent-400"></span>${item}</span>`)
      .join("");

    return `
      <div class="relative z-50 bg-brand-950 text-[0.78rem] text-brand-100">
        <div class="container-x flex h-10 items-center gap-4">
          <span class="inline-flex shrink-0 items-center gap-1.5 rounded bg-accent-500 px-2.5 py-1 text-[0.68rem] font-bold tracking-wider text-white uppercase">
            <i data-lucide="zap" class="size-3"></i> Updates
          </span>
          <div class="relative min-w-0 flex-1 overflow-hidden">
            <div class="flex w-max animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">${items}</div>
          </div>
          <div class="hidden shrink-0 items-center gap-5 border-l border-white/15 pl-5 lg:flex">
            <a href="${CONFIG.PHONE_HREF}" class="inline-flex items-center gap-1.5 hover:text-white"><i data-lucide="phone" class="size-3.5 text-accent-400"></i>${CONFIG.PHONE_DISPLAY}</a>
            <a href="mailto:${CONFIG.EMAIL}" class="inline-flex items-center gap-1.5 hover:text-white"><i data-lucide="mail" class="size-3.5 text-accent-400"></i>${CONFIG.EMAIL}</a>
          </div>
        </div>
      </div>`;
  }

  function megaItem(href, item) {
    return `
      <a href="${href}" class="group/item flex items-start gap-3 rounded-xl p-3 transition hover:bg-brand-50">
        <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-accent-50 text-accent-600 ring-1 ring-accent-100 transition group-hover/item:bg-brand-700 group-hover/item:text-white group-hover/item:ring-brand-700">
          <i data-lucide="${item.icon}" class="size-[18px]"></i>
        </span>
        <span class="min-w-0">
          <span class="block text-sm font-semibold text-ink">${item.title}</span>
          <span class="mt-0.5 block truncate text-xs text-slate-500">${item.summary}</span>
        </span>
      </a>`;
  }

  function megaPanel(kind) {
    const isServices = kind === "services";
    const list = isServices ? CONFIG.SERVICES : CONFIG.SCHEMES;
    const page = isServices ? "services.html" : "schemes.html";
    const items = list.map((item) => megaItem(itemHref(isServices, item.slug), item)).join("");

    const aside = isServices
      ? `<div class="flex flex-col justify-between rounded-xl bg-brand-900 p-6 text-white">
          <div>
            <span class="eyebrow-dark">Free advice</span>
            <p class="mt-4 font-display text-xl font-bold text-white">Not sure where to start?</p>
            <p class="mt-2 text-sm text-brand-100">Tell us your goal. A Vertex advisor will map the right service within 24 hours.</p>
          </div>
          <a href="contact.html" class="btn-primary mt-6 w-full">Book a consultation <i data-lucide="arrow-right" class="size-4"></i></a>
        </div>`
      : `<div class="flex flex-col justify-between rounded-xl bg-accent-50 p-6 ring-1 ring-accent-100">
          <div>
            <span class="eyebrow">Eligibility check</span>
            <p class="mt-4 font-display text-xl font-bold">Which scheme fits you?</p>
            <p class="mt-2 text-sm text-slate-600">We check eligibility, prepare the DPR and handle the application end to end.</p>
          </div>
          <a href="contact.html?service=funding" class="btn-brand mt-6 w-full">Check eligibility <i data-lucide="arrow-right" class="size-4"></i></a>
        </div>`;

    return `
      <div data-mega-panel="${kind}" data-open="false" class="invisible absolute inset-x-0 top-full pt-3 opacity-0 transition-[opacity,visibility] duration-200 data-[open=true]:visible data-[open=true]:opacity-100">
        <div class="grid grid-cols-[1fr_17rem] gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-lift">
          <div>
            <div class="flex items-center justify-between px-3 pt-2 pb-3">
              <p class="text-xs font-bold tracking-[0.16em] text-accent-600 uppercase">${isServices ? "Our services" : "Government schemes"}</p>
              <a href="${page}" class="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:text-accent-600">View all <i data-lucide="arrow-right" class="size-3.5"></i></a>
            </div>
            <div class="grid grid-cols-3 gap-1">${items}</div>
          </div>
          ${aside}
        </div>
      </div>`;
  }

  function renderHeader(currentPage) {
    const links = CONFIG.NAV_LINKS.map((link) => {
      const current = link.page === currentPage ? 'aria-current="page"' : "";
      if (!link.menu) {
        return `<li><a href="${link.href}" class="nav-link" ${current}>${link.label}</a></li>`;
      }
      // The item fills the header height so the pointer never crosses a gap on its way into the panel
      return `
        <li class="flex h-full items-center">
          <a href="${link.href}" class="nav-link" ${current} data-mega-trigger="${link.menu}" aria-haspopup="true" aria-expanded="false">
            ${link.label}<i data-lucide="chevron-down" class="size-4 transition [[aria-expanded=true]>&]:rotate-180"></i>
          </a>
          ${megaPanel(link.menu)}
        </li>`;
    }).join("");

    return `
      <header id="site-nav" class="sticky top-0 z-40 border-b border-transparent bg-white/85 backdrop-blur-xl transition-[box-shadow,border-color] duration-300 data-[scrolled=true]:border-slate-200/70 data-[scrolled=true]:shadow-card">
        <div class="container-x relative flex h-20 items-center justify-between gap-6">
          ${logo()}
          <nav aria-label="Primary" class="hidden h-full xl:block">
            <ul class="flex h-full items-center gap-0.5">${links}</ul>
          </nav>
          <div class="flex items-center gap-2">
            <a href="${CONFIG.PHONE_HREF}" class="hidden size-11 place-items-center rounded-full border border-slate-200 text-brand-700 transition hover:border-brand-300 hover:bg-brand-50 sm:grid xl:hidden" aria-label="Call us">
              <i data-lucide="phone" class="size-[18px]"></i>
            </a>
            <a href="${enquiryHref(currentPage)}" class="btn-brand hidden sm:inline-flex">Get Started <i data-lucide="arrow-up-right" class="size-4"></i></a>
            <button type="button" data-drawer-open class="grid size-11 place-items-center rounded-full bg-brand-50 text-brand-800 ring-1 ring-brand-100 xl:hidden" aria-label="Open menu" aria-controls="mobile-drawer" aria-expanded="false">
              <i data-lucide="menu" class="size-5"></i>
            </button>
          </div>
        </div>
      </header>
      ${renderDrawer(currentPage)}`;
  }

  function drawerGroup(title, page, list) {
    const isServices = page === "services.html";
    const items = list
      .map((item) => `<a href="${itemHref(isServices, item.slug)}" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-50 hover:text-brand-700"><i data-lucide="${item.icon}" class="size-4 text-accent-500"></i>${item.title}</a>`)
      .join("");
    return `
      <details class="group/d rounded-xl">
        <summary class="flex cursor-pointer list-none items-center justify-between rounded-xl px-3 py-3 font-semibold text-ink hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
          ${title}<i data-lucide="chevron-down" class="size-4 transition group-open/d:rotate-180"></i>
        </summary>
        <div class="mt-1 border-l-2 border-brand-100 pl-2">${items}
          <a href="${page}" class="mt-1 flex items-center gap-1 px-3 py-2 text-sm font-semibold text-brand-700">View all <i data-lucide="arrow-right" class="size-3.5"></i></a>
        </div>
      </details>`;
  }

  function renderDrawer(currentPage) {
    const links = CONFIG.NAV_LINKS.map((link) => {
      if (link.menu === "services") return drawerGroup("Services", "services.html", CONFIG.SERVICES);
      if (link.menu === "schemes") return drawerGroup("Schemes", "schemes.html", CONFIG.SCHEMES);
      const active = link.page === currentPage ? "bg-brand-50 text-brand-700" : "text-ink";
      return `<a href="${link.href}" data-drawer-link class="block rounded-xl px-3 py-3 font-semibold hover:bg-slate-50 ${active}">${link.label}</a>`;
    }).join("");

    return `
      <div id="mobile-drawer" class="pointer-events-none fixed inset-0 z-[60] xl:hidden" aria-hidden="true">
        <div data-drawer-close class="absolute inset-0 bg-ink/50 opacity-0 backdrop-blur-sm transition duration-300 [.is-open_&]:pointer-events-auto [.is-open_&]:opacity-100"></div>
        <aside class="absolute inset-y-0 right-0 flex w-full max-w-sm translate-x-full flex-col bg-white shadow-2xl transition duration-300 [.is-open_&]:pointer-events-auto [.is-open_&]:translate-x-0" role="dialog" aria-modal="true" aria-label="Menu">
          <div class="flex h-20 items-center justify-between border-b border-slate-100 px-5">
            ${logo({ className: "h-12" })}
            <button type="button" data-drawer-close class="grid size-10 place-items-center rounded-full bg-slate-100 text-ink" aria-label="Close menu">
              <i data-lucide="x" class="size-5"></i>
            </button>
          </div>
          <nav aria-label="Mobile" class="flex-1 space-y-1 overflow-y-auto p-4">${links}</nav>
          <div class="space-y-3 border-t border-slate-100 p-5">
            <a href="${enquiryHref(currentPage)}" data-drawer-link class="btn-primary w-full">Book Free Consultation <i data-lucide="arrow-right" class="size-4"></i></a>
            <a href="${CONFIG.PHONE_HREF}" class="btn-outline w-full"><i data-lucide="phone" class="size-4"></i>${CONFIG.PHONE_DISPLAY}</a>
          </div>
        </aside>
      </div>`;
  }

  function footerLinks(title, links) {
    const items = links.map((link) => `<li><a href="${link.href}" class="inline-flex items-center gap-2 text-sm text-brand-100/80 transition hover:translate-x-0.5 hover:text-white">${link.label}</a></li>`).join("");
    return `
      <div>
        <p class="font-display text-sm font-bold tracking-wide text-white">${title}</p>
        <ul class="mt-5 space-y-3">${items}</ul>
      </div>`;
  }

  function renderFooter(currentPage) {
    const year = new Date().getFullYear();
    const services = CONFIG.SERVICES.map((s) => ({ label: s.title, href: `services.html#${s.slug}` }));
    const schemes = CONFIG.SCHEMES.slice(0, 7).map((s) => ({ label: s.title, href: itemHref(false, s.slug) }));
    const company = [
      { label: "About Us", href: "about.html" },
      { label: "Why Choose Us", href: "about.html#why-us" },
      { label: "Insights", href: "index.html#insights" },
      { label: "Careers", href: "careers.html" },
      { label: "Contact Us", href: "contact.html" },
      { label: "All Schemes", href: "schemes.html" },
    ];
    const socials = CONFIG.SOCIAL_LINKS.map((s) => `<a href="${s.href}" target="_blank" rel="noopener" aria-label="${s.label}" class="grid size-10 place-items-center rounded-full bg-white/5 text-brand-100 ring-1 ring-white/10 transition hover:bg-accent-500 hover:text-white hover:ring-accent-500">${brandIcon(s.icon, "size-4")}</a>`).join("");

    return `
      <footer class="relative overflow-hidden bg-brand-950 pb-20 text-brand-100 md:pb-0">
        <div class="container-x relative">
          <div class="grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
            <div class="lg:col-span-4">
              ${logo({ isDark: true, className: "h-16" })}
              <p class="mt-6 max-w-sm text-sm leading-relaxed text-brand-100/80">One trusted partner for ISO certification, regulatory compliance, business funding, recruitment and management advisory, for startups, MSMEs and enterprises across India.</p>
              <div class="mt-6 flex gap-2.5">${socials}</div>
            </div>
            <div class="grid gap-10 sm:grid-cols-3 lg:col-span-5">
              ${footerLinks("Services", services)}
              ${footerLinks("Popular Schemes", schemes)}
              ${footerLinks("Company", company)}
            </div>
            <div class="lg:col-span-3">
              <p class="font-display text-sm font-bold tracking-wide text-white">Get in touch</p>
              <ul class="mt-5 space-y-4 text-sm">
                <li><a href="${CONFIG.PHONE_HREF}" class="flex gap-3 hover:text-white"><i data-lucide="phone" class="mt-0.5 size-4 shrink-0 text-accent-400"></i>${CONFIG.PHONE_DISPLAY}</a></li>
                <li><a href="mailto:${CONFIG.EMAIL}" class="flex gap-3 break-all hover:text-white"><i data-lucide="mail" class="mt-0.5 size-4 shrink-0 text-accent-400"></i>${CONFIG.EMAIL}</a></li>
                <li><a href="${CONFIG.MAP_URL}" target="_blank" rel="noopener" class="flex gap-3 hover:text-white"><i data-lucide="map-pin" class="mt-0.5 size-4 shrink-0 text-accent-400"></i><span>${CONFIG.ADDRESS_LINES.join("<br />")}</span></a></li>
                <li class="flex gap-3"><i data-lucide="clock" class="mt-0.5 size-4 shrink-0 text-accent-400"></i>${CONFIG.WORKING_HOURS}</li>
              </ul>
            </div>
          </div>
          <div class="border-t border-white/10 py-6 text-xs text-brand-100/60">
            <p class="leading-relaxed">Disclaimer: ${CONFIG.SITE_NAME} is a private consulting firm and is not affiliated with any government department. Scheme benefits, limits and timelines are subject to eligibility and prevailing government guidelines.</p>
            <div class="mt-4 flex flex-col justify-between gap-2 sm:flex-row">
              <p>&copy; ${year} ${CONFIG.SITE_NAME}. All rights reserved.</p>
              <p>${CONFIG.SITE_TAGLINE}</p>
            </div>
          </div>
        </div>
      </footer>
      ${renderFloating(currentPage)}`;
  }

  function renderFloating(currentPage) {
    return `
      <a href="${whatsappUrl()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" class="fixed right-5 bottom-5 z-40 hidden size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-sm transition hover:scale-105 md:grid">
        ${brandIcon("whatsapp", "relative size-7")}
      </a>
      <button type="button" data-back-to-top aria-label="Back to top" class="fixed right-6 bottom-24 z-40 hidden size-11 translate-y-3 place-items-center rounded-full bg-white text-brand-700 opacity-0 shadow-lift ring-1 ring-slate-200 transition data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 md:grid">
        <i data-lucide="arrow-up" class="size-5"></i>
      </button>
      <nav aria-label="Quick actions" class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
        <a href="${CONFIG.PHONE_HREF}" class="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold text-ink"><i data-lucide="phone" class="size-5 text-brand-700"></i>Call</a>
        <a href="${whatsappUrl()}" target="_blank" rel="noopener" class="flex flex-col items-center gap-1 py-2.5 text-[0.7rem] font-semibold text-ink">${brandIcon("whatsapp", "size-5 text-[#25D366]")}WhatsApp</a>
        <a href="${enquiryHref(currentPage)}" class="flex flex-col items-center gap-1 bg-accent-500 py-2.5 text-[0.7rem] font-semibold text-white"><i data-lucide="send" class="size-5"></i>Enquire</a>
      </nav>`;
  }

  window.VertexLayout = {
    whatsappUrl,
    render() {
      const page = document.body.dataset.page || "";
      const root = document.body.dataset.root || "";
      const header = document.getElementById("site-header");
      const footer = document.getElementById("site-footer");
      if (header) header.replaceWith(withRoot(renderTopbar() + renderHeader(page), root));
      if (footer) footer.replaceWith(withRoot(renderFooter(page), root));
    },
  };
})();
