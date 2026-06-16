gsap.registerPlugin(ScrollTrigger);

// ── TOUCH / MOBILE: disable custom cursor ────────────
const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (isTouch) {
  document.body.classList.add("no-cursor");
}

// ── CURSOR ───────────────────────────────────────────
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursorRing");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

if (!isTouch) {
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(cursor, { x: mx, y: my });
    gsap.set(cursorRing, { x: rx, y: ry });
  });

  document.querySelectorAll("a, button, .skill-chip, .project-card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursorRing.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursorRing.classList.remove("hover"));
  });
}

// ── SCROLL PROGRESS ──────────────────────────────────
const scrollProgress = document.getElementById("scrollProgress");
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    scrollProgress.style.width = `${self.progress * 100}%`;
  }
});

// ── BACKGROUND DRIFT ─────────────────────────────────
const plasma = document.getElementById("bgPlasma");
const bv = {
  b1x: 20,
  b1y: 30,
  b2x: 80,
  b2y: 15,
  b3x: 55,
  b3y: 85,
  b4x: 10,
  b4y: 80
};

gsap.ticker.add(() => {
  plasma.style.background = `
    radial-gradient(ellipse 70% 70% at ${bv.b1x}% ${bv.b1y}%, hsl(330,100%,55%) 0%, transparent 55%),
    radial-gradient(ellipse 60% 60% at ${bv.b2x}% ${bv.b2y}%, hsl(52,100%,50%)  0%, transparent 55%),
    radial-gradient(ellipse 65% 65% at ${bv.b3x}% ${bv.b3y}%, hsl(20,100%,55%)  0%, transparent 55%),
    radial-gradient(ellipse 50% 50% at ${bv.b4x}% ${bv.b4y}%, hsl(185,100%,52%) 0%, transparent 50%),
    hsl(48,100%,93%)
  `;
});

gsap.to(bv, {
  b1x: 40,
  b1y: 55,
  b2x: 65,
  b2y: 35,
  b3x: 30,
  b3y: 60,
  b4x: 85,
  b4y: 25,
  duration: 10,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});

// ── FLOATING STARS ───────────────────────────────────
["s1", "s2", "s3", "s4"].forEach((id, i) => {
  gsap.to("#" + id, {
    y: -20,
    rotation: 25 + i * 10,
    scale: 1.15,
    duration: 2.5 + i * 0.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: i * 0.3
  });
});

// ── BADGES FLOAT ─────────────────────────────────────
["badgeLeft", "badgeMid", "badgeBot"].forEach((id, i) => {
  gsap.to("#" + id, {
    y: -8,
    duration: 1.8 + i * 0.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: i * 0.4
  });
});

// ── NAV ──────────────────────────────────────────────
const siteNav = document.getElementById("siteNav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: () => {
    siteNav.classList.toggle("scrolled", ScrollTrigger.scroll() > 80);
  }
});

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("open");
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-link, .scroll-hint").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll(".portfolio-section");
const navLinkEls = document.querySelectorAll(".nav-link[href^='#']");

sections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActiveNav(section.id),
    onEnterBack: () => setActiveNav(section.id)
  });
});

function setActiveNav(id) {
  navLinkEls.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
}

// Back to top
document.getElementById("backToTop").addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── ENTRANCE + SCROLL ANIMATIONS ─────────────────────
window.addEventListener("load", () => {
  const rowA = document.getElementById("rowA");
  const rowB = document.getElementById("rowB");

  gsap.set([rowA, rowB], { yPercent: 105 });
  gsap.set(["#badgeLeft", "#badgeMid", "#badgeBot"], {
    opacity: 0,
    scale: 0.8
  });
  gsap.set([".bracket"], { opacity: 0 });

  const intro = gsap.timeline({ delay: 0.15 });

  intro
    .to(rowA, { yPercent: 0, duration: 0.9, ease: "power3.out" })
    .to(rowB, { yPercent: 0, duration: 0.9, ease: "power3.out" }, "-=0.65")
    .to(
      [".bracket"],
      { opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      "-=0.4"
    )
    .to(
      ["#badgeLeft", "#badgeMid", "#badgeBot"],
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.8)"
      },
      "-=0.3"
    );

  // ── HERO SCROLL TIMELINE ───────────────────────────
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#wrapper",
      start: "top top",
      end: "+=180%",
      pin: true,
      scrub: 1
    }
  });

  tl.fromTo(
    "#heroImg",
    { scale: 1, z: 0 },
    {
      scale: 2.2,
      z: 350,
      transformOrigin: "center center",
      ease: "power1.inOut"
    },
    0
  )
    .fromTo(
      rowA,
      { yPercent: 0, opacity: 1 },
      { yPercent: -120, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      rowB,
      { yPercent: 0, opacity: 1 },
      { yPercent: 120, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#badgeLeft",
      { x: 0, opacity: 1 },
      { x: -120, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#badgeMid",
      { y: 0, opacity: 1 },
      { y: -80, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#badgeBot",
      { x: 0, opacity: 1 },
      { x: 120, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#s1",
      { x: 0, y: 0, opacity: 1 },
      { x: -80, y: -60, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#s2",
      { x: 0, y: 0, opacity: 1 },
      { x: -60, y: 80, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#s3",
      { x: 0, y: 0, opacity: 1 },
      { x: 80, y: -80, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      "#s4",
      { x: 0, y: 0, opacity: 1 },
      { x: 60, y: 80, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      ["#bTL", "#bBR"],
      { scale: 1, opacity: 1 },
      { scale: 0.5, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo(
      ["#bTR", "#bBL"],
      { scale: 1, opacity: 1 },
      { scale: 0.5, opacity: 0, ease: "power2.in" },
      0
    )
    .fromTo("#bgPlasma", { opacity: 1 }, { opacity: 0, ease: "power2.in" }, 0.3)
    .fromTo(".scanlines", { opacity: 0.6 }, { opacity: 1.5, ease: "none" }, 0);

  // HUD year counter
  const hud = document.getElementById("hudYear");
  ScrollTrigger.create({
    trigger: "#wrapper",
    start: "top top",
    end: "+=180%",
    scrub: true,
    onUpdate: (self) => {
      const year = Math.round(2024 + self.progress * 2);
      hud.textContent = year;
    }
  });

  // Below section reveal
  gsap.from("#belowText", {
    scrollTrigger: {
      trigger: ".section-below",
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 60,
    duration: 1,
    ease: "power3.out"
  });

  // Section reveal animations (exclude project cards — they have their own)
  gsap.utils.toArray(".reveal:not(.project-card)").forEach((el) => {
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  });

  // Stagger skill chips
  document.querySelectorAll(".skill-group").forEach((group) => {
    const chips = group.querySelectorAll(".skill-chip");
    gsap.from(chips, {
      scrollTrigger: {
        trigger: group,
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 20,
      scale: 0.9,
      duration: 0.5,
      stagger: 0.06,
      ease: "back.out(1.5)"
    });
  });

  // Project cards — single staggered trigger, no reverse
  gsap.from(".project-card", {
    scrollTrigger: {
      trigger: ".projects-grid",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
    clearProps: "transform"
  });

  // Contact items stagger
  gsap.from(".contact-item", {
    scrollTrigger: {
      trigger: ".contact-links",
      start: "top 85%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    x: 30,
    duration: 0.6,
    stagger: 0.1,
    ease: "power3.out"
  });
});
