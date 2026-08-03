(function () {
  "use strict";

  // Year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Sticky nav style + back-to-top
  var nav = document.getElementById("mainNav");
  var toTop = document.getElementById("toTop");
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    toTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Close mobile menu after clicking a link
  var menu = document.getElementById("navMenu");
  document.querySelectorAll("#navMenu .nav-link, #navMenu .btn").forEach(function (link) {
    link.addEventListener("click", function () {
      if (menu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  // Active section highlighting (scrollspy)
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#navMenu .nav-link'));
  var sections = navLinks.map(function (l) {
    return document.querySelector(l.getAttribute("href"));
  });
  function setActive() {
    var pos = window.scrollY + nav.offsetHeight + 40;
    var current = 0;
    sections.forEach(function (s, i) {
      if (s && s.offsetTop <= pos) current = i;
    });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections.length - 1;
    }
    navLinks.forEach(function (l, i) {
      l.classList.toggle("active", i === current);
    });
  }
  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();

  // Smooth scrolling with sticky-navbar offset
  navLinks.concat(Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]:not(.nav-link)')))
    .forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - (id === "#home" ? 0 : nav.offsetHeight - 1);
        window.scrollTo({ top: top, behavior: "smooth" });
        history.replaceState(null, "", id);
      });
    });

  // Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e, i) {
          if (e.isIntersecting) {
            setTimeout(function () {
              e.target.classList.add("in");
            }, i * 90);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  // Counter animation
  var counters = document.querySelectorAll(".num");
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      el.textContent = Math.floor(p * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCounter(e.target);
            co.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (c) {
      co.observe(c);
    });
  }

  // Contact form validation (front-end only)
  var form = document.getElementById("contactForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      note.textContent = "Please fix the highlighted fields.";
      note.style.color = "#dc3545";
      return;
    }
    note.textContent = "Thanks! Your message has been sent.";
    note.style.color = "";
    form.reset();
    form.classList.remove("was-validated");
  });
})();
