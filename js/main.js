(function () {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (header) {
    window.addEventListener(
      "scroll",
      () => header.classList.toggle("scrolled", window.scrollY > 32),
      { passive: true }
    );
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        nav.classList.contains("open").toString()
      );
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  document.querySelectorAll(".screen-img, .showcase-img, .bento-img").forEach((img) => {
    const parent = img.closest(".phone-screen, .showcase-frame, .bento-visual");
    const mock = parent?.querySelector(".screen-mock, .bento-placeholder");
    const hideMock = () => {
      if (mock) mock.style.display = "none";
      img.classList.add("loaded");
    };
    const showMock = () => {
      img.classList.remove("loaded");
      if (mock) mock.style.display = "";
    };

    if (img.complete && img.naturalWidth > 1) hideMock();
    else showMock();

    img.addEventListener("load", hideMock);
    img.addEventListener("error", showMock);
  });

  window.addEventListener("load", () => {
    document.body.classList.add("is-loaded");
    document
      .querySelectorAll(".screen-img, .showcase-img, .bento-img")
      .forEach((img) => {
        if (img.complete && img.naturalWidth > 1) {
          img.classList.add("loaded");
          const parent = img.closest(".phone-screen, .showcase-frame, .bento-visual");
          const mock = parent?.querySelector(".screen-mock, .bento-placeholder");
          if (mock) mock.style.display = "none";
        }
      });
  });

  document.querySelectorAll(".stagger-group").forEach((group) => {
    const items = group.querySelectorAll(".reveal");
    items.forEach((el, i) => {
      el.setAttribute("data-delay", String(Math.min(i + 1, 8)));
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  if (!prefersReducedMotion) {
    const heroShowcase = document.querySelector(".hero-showcase");
    if (heroShowcase) {
      heroShowcase.style.perspective = "1400px";
      const tiltTargets = heroShowcase.querySelectorAll(
        ".phone-main, .phone-float"
      );
      heroShowcase.addEventListener("mousemove", (e) => {
        const rect = heroShowcase.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tiltTargets.forEach((el, i) => {
          const depth = i === 0 ? 1 : 0.6;
          const rotY = x * 12 * depth;
          const rotX = -y * 10 * depth;
          const base =
            el.classList.contains("phone-float-left")
              ? "rotate(-8deg)"
              : el.classList.contains("phone-float-right")
                ? "rotate(10deg)"
                : "";
          el.style.transform = `${base} rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        });
      });
      heroShowcase.addEventListener("mouseleave", () => {
        tiltTargets.forEach((el) => {
          el.style.transform = "";
        });
      });
    }
  }
})();
