(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelectorAll(".nav-links a");
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  var CONTACT_EMAIL = "info@meditusa.com";

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
    link.addEventListener("click", function () {
      setNav(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNav(false);
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = (form.elements.namedItem("name") || {}).value || "";
      var email = (form.elements.namedItem("email") || {}).value || "";
      var message = (form.elements.namedItem("message") || {}).value || "";
      name = name.trim();
      email = email.trim();
      message = message.trim();

      if (!name || !email || !message) {
        if (status) {
          status.dataset.state = "error";
          status.textContent = "Please fill in your name, email and message.";
        }
        return;
      }

      var subject = "Website enquiry from " + name;
      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;

      var mailto =
        "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      if (status) {
        status.dataset.state = "ok";
        status.textContent = "Opening your email app to send the message…";
      }

      window.location.href = mailto;
    });
  }
})();
