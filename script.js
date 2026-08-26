const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
document.documentElement.dataset.siteVersion = "v.40";

toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  nav.classList.toggle("open", !open);
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".main-nav a[href^='#']");

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    document.querySelectorAll(".main-nav a").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visible.target.id}`,
      );
    });
  },
  { rootMargin: "-30% 0px -55%", threshold: [0.05, 0.25, 0.5] },
);

sections.forEach((section) => observer.observe(section));
document.querySelectorAll("#year").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

// Crédito común para las páginas actuales y las nuevas que usen este archivo.
document.querySelectorAll("footer").forEach((footer) => {
  if (!footer.querySelector(".footer-contact")) {
    const contact = document.createElement("div");
    contact.className = "footer-contact contact-options";
    contact.setAttribute("aria-label", "Contacto con Tetra Taller");
    contact.innerHTML = `
      <a class="contact-icon contact-icon-email" href="https://mail.google.com/mail/?view=cm&amp;fs=1&amp;to=tetrataller%40gmail.com" target="_blank" rel="noopener" aria-label="Enviar correo a Tetra Taller" title="Correo">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 6.5h18v11H3z"/><path d="m4 7.5 8 6 8-6"/></svg>
      </a>
      <a class="contact-icon contact-icon-whatsapp" href="https://wa.me/523345175877" target="_blank" rel="noopener" aria-label="Escribir a Tetra Taller por WhatsApp" title="WhatsApp">
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20 11.6a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z"/><path d="M8.3 7.8c.3-.5.6-.5.9-.5h.4c.2 0 .4.1.5.4l.8 1.8c.1.3 0 .5-.2.7l-.6.7c-.2.2-.1.4 0 .6.8 1.4 2 2.5 3.5 3.2.3.1.5.1.7-.1l.8-1c.2-.2.4-.3.7-.2l1.8.9c.3.1.4.3.4.6 0 .6-.3 1.4-.8 1.8-.5.5-1.3.8-2.1.7-1.3-.2-3.2-.8-5.1-2.5-1.5-1.4-2.7-3.2-3.1-4.6-.4-1.2-.1-2 .4-2.5Z"/></svg>
      </a>`;
    footer.appendChild(contact);
  }
  let credit = footer.querySelector(".tetra-credit");
  if (!credit) {
    credit = document.createElement("a");
    credit.className = "tetra-credit";
    credit.href = "https://wa.me/523345175877?text=Hola%20Tetra%20Taller%2C%20vi%20uno%20de%20sus%20sitios%20web%20y%20quiero%20informaci%C3%B3n.";
    credit.target = "_blank";
    credit.rel = "noopener";
    credit.textContent = "Diseño y desarrollo por Tetra Taller";
  }

  const contact = footer.querySelector(".footer-contact");
  const creditBlock = document.createElement("div");
  creditBlock.className = "footer-credit-block";
  creditBlock.append(credit, contact);
  footer.appendChild(creditBlock);
});

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel-track");
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dots = carousel.querySelector(".carousel-dots");
  let current = 0;
  let autoplayTimer;
  let isVisible = false;
  let isPaused = false;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = `carousel-dot${index === 0 ? " active" : ""}`;
    dots.appendChild(dot);
  });

  const update = (index) => {
    current = (index + slides.length) % slides.length;
    track.scrollTo({ left: track.clientWidth * current, behavior: "smooth" });
    dots.querySelectorAll(".carousel-dot").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = undefined;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reduceMotion || isPaused || !isVisible) return;
    autoplayTimer = window.setInterval(() => update(current + 1), 4500);
  };

  const manualUpdate = (index) => {
    update(index);
    startAutoplay();
  };

  carousel.querySelector("[data-prev]").addEventListener("click", () => {
    manualUpdate(current - 1);
  });

  carousel.querySelector("[data-next]").addEventListener("click", () => {
    manualUpdate(current + 1);
  });

  let scrollTimer;
  track.addEventListener("scroll", () => {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const index = Math.round(track.scrollLeft / track.clientWidth);
      if (index !== current) update(index);
    }, 80);
  });

  carousel.addEventListener("mouseenter", () => {
    isPaused = true;
    stopAutoplay();
  });

  carousel.addEventListener("mouseleave", () => {
    isPaused = false;
    startAutoplay();
  });

  carousel.addEventListener("focusin", () => {
    isPaused = true;
    stopAutoplay();
  });

  carousel.addEventListener("focusout", () => {
    isPaused = false;
    startAutoplay();
  });

  carousel.addEventListener("touchstart", () => {
    isPaused = true;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener("touchend", () => {
    isPaused = false;
    startAutoplay();
  }, { passive: true });

  const carouselObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) startAutoplay();
      else stopAutoplay();
    },
    { threshold: 0.35 },
  );

  carouselObserver.observe(carousel);
  window.addEventListener("resize", () => update(current));
});

// Carrusel de ejemplos contenido exclusivamente dentro del teléfono.
document.querySelectorAll("[data-loyalty-carousel]").forEach((carousel) => {
  const passes = [...carousel.querySelectorAll(".wallet-pass")];
  const dots = carousel.querySelector(".wallet-carousel-dots");
  const previous = carousel.querySelector("[data-pass-prev]");
  const next = carousel.querySelector("[data-pass-next]");
  let current = 0;
  let timer;

  passes.forEach((pass, index) => {
    const dot = document.createElement("i");
    dot.classList.toggle("active", index === 0);
    dots?.appendChild(dot);
  });

  const show = (index) => {
    current = (index + passes.length) % passes.length;
    passes.forEach((pass, passIndex) => {
      const active = passIndex === current;
      pass.classList.toggle("wallet-pass-active", active);
      pass.setAttribute("aria-hidden", String(!active));
    });
    dots?.querySelectorAll("i").forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === current);
    });
    carousel.dataset.activePass = String(current + 1);
  };

  const start = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => show(current + 1), 3200);
  };

  previous?.addEventListener("click", () => { show(current - 1); start(); });
  next?.addEventListener("click", () => { show(current + 1); start(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.clearInterval(timer);
    else start();
  });
  show(0);
  start();
});

// Carrusel automático de tarjetas de presentación digitales.
document.querySelectorAll("[data-digital-card-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".digital-profile-slide")];
  const dots = carousel.querySelector(".digital-profile-dots");
  const previous = carousel.querySelector("[data-digital-prev]");
  const next = carousel.querySelector("[data-digital-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer;
  let paused = false;
  let visible = true;

  if (!slides.length) return;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver ejemplo ${index + 1}`);
    dot.addEventListener("click", () => { show(index); start(); });
    dots?.appendChild(dot);
  });

  const stop = () => { window.clearInterval(timer); timer = undefined; };
  const start = () => {
    stop();
    if (reduceMotion || paused || !visible) return;
    timer = window.setInterval(() => show(current + 1), 4200);
  };

  previous?.addEventListener("click", () => { show(current - 1); start(); });
  next?.addEventListener("click", () => { show(current + 1); start(); });
  carousel.addEventListener("mouseenter", () => { paused = true; stop(); });
  carousel.addEventListener("mouseleave", () => { paused = false; start(); });
  carousel.addEventListener("focusin", () => { paused = true; stop(); });
  carousel.addEventListener("focusout", () => { paused = false; start(); });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: .3 });
    observer.observe(carousel);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  show(0);
  start();
});

// Carrusel de la portada Digital: cinco servicios con avance automático y controles.
document.querySelectorAll("[data-hero-digital-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".digital-hero-slide")];
  const dots = carousel.querySelector(".digital-hero-dots");
  const previous = carousel.querySelector("[data-hero-digital-prev]");
  const next = carousel.querySelector("[data-hero-digital-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer;
  let paused = false;

  if (!slides.length) return;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver ${slide.querySelector("figcaption")?.textContent || `opción ${index + 1}`}`);
    dot.addEventListener("click", () => { show(index); start(); });
    dots?.appendChild(dot);
  });

  const stop = () => { window.clearInterval(timer); timer = undefined; };
  const start = () => {
    stop();
    if (reduceMotion || paused) return;
    timer = window.setInterval(() => show(current + 1), 4200);
  };

  previous?.addEventListener("click", () => { show(current - 1); start(); });
  next?.addEventListener("click", () => { show(current + 1); start(); });
  carousel.addEventListener("mouseenter", () => { paused = true; stop(); });
  carousel.addEventListener("mouseleave", () => { paused = false; start(); });
  carousel.addEventListener("focusin", () => { paused = true; stop(); });
  carousel.addEventListener("focusout", () => { paused = false; start(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  show(0);
  start();
});

// Carrusel de la portada 3D: reparación, emprendimiento, trabajo y creatividad.
document.querySelectorAll("[data-hero-3d-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".three-d-hero-slide")];
  const dots = carousel.querySelector(".three-d-hero-dots");
  const previous = carousel.querySelector("[data-hero-3d-prev]");
  const next = carousel.querySelector("[data-hero-3d-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let current = 0;
  let timer;
  let paused = false;

  if (!slides.length) return;

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === current;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    dots?.querySelectorAll("button").forEach((dot, dotIndex) => {
      const active = dotIndex === current;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Ver ${slide.querySelector("figcaption")?.textContent || `posibilidad ${index + 1}`}`);
    dot.addEventListener("click", () => { show(index); start(); });
    dots?.appendChild(dot);
  });

  const stop = () => { window.clearInterval(timer); timer = undefined; };
  const start = () => {
    stop();
    if (reduceMotion || paused) return;
    timer = window.setInterval(() => show(current + 1), 4500);
  };

  previous?.addEventListener("click", () => { show(current - 1); start(); });
  next?.addEventListener("click", () => { show(current + 1); start(); });
  carousel.addEventListener("mouseenter", () => { paused = true; stop(); });
  carousel.addEventListener("mouseleave", () => { paused = false; start(); });
  carousel.addEventListener("focusin", () => { paused = true; stop(); });
  carousel.addEventListener("focusout", () => { paused = false; start(); });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  show(0);
  start();
});
