(function () {
  document.documentElement.classList.add("js");

  var CONTACT_EMAIL = "meditusa2023@gmail.com";
  var header = document.getElementById("site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav-links a");
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Glass header on scroll
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function setNav(open) {
    if (!header || !toggle) return;
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!header.classList.contains("nav-open"));
    });
  }
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () { setNav(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  // Scroll reveal
  var items = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }


  // Photo backgrounds: slow zoom when in view + light parallax
  var bgSections = document.querySelectorAll(".has-bg");
  if (!reduce && "IntersectionObserver" in window) {
    var visible = new Set();
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); visible.add(e.target); }
        else visible.delete(e.target);
      });
      tick();
    }, { threshold: 0.05 });
    bgSections.forEach(function (s) { bio.observe(s); });
    var ticking = false;
    function tick() {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        visible.forEach(function (s) {
          var r = s.getBoundingClientRect();
          var progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height);
          var img = s.querySelector(".section-bg img");
          if (img) img.style.setProperty("--py", (progress * -30).toFixed(1) + "px");
        });
        ticking = false;
      });
    }
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
  } else {
    bgSections.forEach(function (s) { s.classList.add("in-view"); });
  }

  // Contact form -> visitor's email app
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var get = function (n) { var f = form.elements.namedItem(n); return f ? String(f.value).trim() : ""; };
      var name = get("name"), email = get("email"), topic = get("topic"), message = get("message");

      if (!name || !email || !message) {
        status.dataset.state = "error";
        status.textContent = "Please add your name, email address and message.";
        return;
      }
      var subject = "Enquiry: " + (topic || "General") + " (" + name + ")";
      var body = "Name: " + name + "\nEmail: " + email + "\nEnquiry about: " + topic + "\n\n" + message;
      status.dataset.state = "ok";
      status.textContent = "Opening your email app…";
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }
})();
