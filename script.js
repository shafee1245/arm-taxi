/* =====================================================
   ARM TAXI – MAIN FRONTEND SCRIPT
   Senior Frontend Refactor (Safe & Modular)
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------------------
     MOBILE NAV / HAMBURGER
  ----------------------------------------------------- */
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    const navItems = navLinks.querySelectorAll("a");

    const closeMenu = () => {
      navLinks.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
      document.body.style.overflow = "";
    };

    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = navLinks.classList.toggle("active");
      mobileMenuBtn.classList.toggle("active");

      mobileMenuBtn.innerHTML = isOpen
        ? `<i class="fas fa-times"></i>`
        : `<i class="fas fa-bars"></i>`;

      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navItems.forEach(link =>
      link.addEventListener("click", closeMenu)
    );

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* -----------------------------------------------------
     BOOKING TAB SWITCH (ONE WAY / ROUND TRIP)
  ----------------------------------------------------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  let activeTab = "one-way";

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      if (!tabId || tabId === activeTab) return;

      const currentForm = document.getElementById(`${activeTab}-form`);
      const nextForm = document.getElementById(`${tabId}-form`);

      if (!currentForm || !nextForm) return;

      tabBtns.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");

      currentForm.classList.add("sliding-out");
      nextForm.classList.add("sliding-in");

      setTimeout(() => {
        currentForm.classList.remove("active", "sliding-out");
        nextForm.classList.add("active");
        nextForm.classList.remove("sliding-in");
        activeTab = tabId;
      }, 400);
    });
  });

  /* -----------------------------------------------------
     BOOKING FORM SUBMIT
  ----------------------------------------------------- */
  const oneWayForm = document.getElementById("oneWayForm");
  const roundTripForm = document.getElementById("roundTripForm");

  const bookingSuccess = (type) => {
    alert(`Thank you for booking ${type}. Our team will contact you shortly.`);
  };

  oneWayForm?.addEventListener("submit", e => {
    e.preventDefault();
    bookingSuccess("One Way Taxi");
    oneWayForm.reset();
  });

  roundTripForm?.addEventListener("submit", e => {
    e.preventDefault();
    bookingSuccess("Round Trip Taxi");
    roundTripForm.reset();
  });

  /* -----------------------------------------------------
     DATE HANDLING
  ----------------------------------------------------- */
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  const setDate = (id, min, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.min = min;
    if (value) el.value = value;
  };

  setDate("oneWayDate", today, today);
  setDate("roundTripDate", today, today);
  setDate("roundTripReturnDate", today, tomorrow);

  /* -----------------------------------------------------
     STATS COUNTER
  ----------------------------------------------------- */
  function animateCounter(id, start, end, duration) {
    const el = document.getElementById(id);
    if (!el) return;

    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      let value = Math.floor(progress * (end - start) + start);

      if (id === "stat2") el.textContent = `${value}%`;
      else if (id === "stat3") el.textContent = `${value}+`;
      else el.textContent = value;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  animateCounter("stat1", 0, 150000, 2000);
  animateCounter("stat2", 0, 96, 2000);
  animateCounter("stat3", 0, 5000, 2000);

  /* -----------------------------------------------------
     INTERSECTION OBSERVER (SCROLL ANIMATIONS)
  ----------------------------------------------------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, { threshold: 0.15 });

  document
    .querySelectorAll(".tariff-card, .info-card, .about-stat")
    .forEach(el => observer.observe(el));

  /* -----------------------------------------------------
     SMOOTH SCROLL
  ----------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* -----------------------------------------------------
     FLOATING CONTACT
  ----------------------------------------------------- */
  const floating = document.querySelector(".floating-contact");
  if (floating) {
    floating.style.opacity = "0";

    setTimeout(() => {
      floating.style.transition = "all .3s ease";
      floating.style.opacity = "1";
      floating.style.transform = "translateY(0)";
    }, 400);

    window.addEventListener("scroll", () => {
      floating.style.opacity = window.scrollY > 300 ? "1" : "0.9";
    });
  }

});