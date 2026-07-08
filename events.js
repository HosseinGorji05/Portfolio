(function () {
  "use strict";

  window.PORTFOLIO_EVENTS = [
    {
      id: "google-toronto",
      title: "Google Toronto HQ — Engineering, AI & Innovation",
      date: "Jul 2026",
      badge: "GDG on Campus @ York",
      meta: "Google King St HQ · case competition & office tour",
      caption:
        "Selected through GDG on Campus @ York University for an engineering-focused visit to Google Toronto — AI in modern development workflows, a live student demo, office tour, and time with Google engineers.",
      linkedin: "https://www.linkedin.com/in/hossein-gorji-745488281",
      photos: [
        "events/google-toronto/01.jpg",
        "events/google-toronto/02.jpg",
        "events/google-toronto/03.jpg",
      ],
    },
    {
      id: "cursor-hack",
      title: "Cursor Hackathon Toronto",
      date: "Jun 2026",
      badge: "3rd of 20+ teams",
      meta: "2-person team · Lens & Love · 296 participants",
      caption:
        "Teamed up with Harshita Dhawan and placed 3rd of 20+ teams among 296 participants — shipping Lens & Love, a wedding-photographer SaaS with invoicing and a voice-controlled assistant, in a one-hour sprint with Cursor.",
      linkedin: "https://www.linkedin.com/in/hossein-gorji-745488281",
      photos: [
        "events/cursor-hack/01.jpg",
        "events/cursor-hack/02.jpg",
        "events/cursor-hack/03.jpg",
      ],
    },
    {
      id: "nvidia-spark",
      title: "NVIDIA Spark Hack Toronto",
      date: "May 2026",
      badge: "Delatio · GIS",
      meta: "5-person team · Grace Blackwell GB10",
      caption:
        "Owned the GIS data layer for Delatio — a local-first edge-compute urban risk platform with spatial queries under 20 ms.",
      linkedin:
        "https://www.linkedin.com/posts/hossein-gorji-745488281_nvidia-sparkhack-torontoopendata-ugcPost-7467748324012478465-91LA",
      photos: [
        "events/nvidia-spark/01.jpg",
        "events/nvidia-spark/02.jpg",
        "events/nvidia-spark/03.jpg",
      ],
    },
    {
      id: "ctrl-hack-del",
      title: "CTRL+HACK+DEL",
      date: "Feb 2026",
      badge: "Potluckio · UI/UX",
      meta: "2-person team · live demo shipped",
      caption:
        "Lead UI/UX and Git workflow on Potluckio — a real-time group meal-planning app with live Firestore item-claiming.",
      linkedin:
        "https://www.linkedin.com/posts/hossein-gorji-745488281_freeiran-ugcPost-7438404803501760512-ktyW",
      photos: [
        "events/ctrl-hack-del/01.jpg",
        "events/ctrl-hack-del/02.jpg",
        "events/ctrl-hack-del/03.jpg",
      ],
    },
  ];

  function initEventPhotos() {
    document.querySelectorAll(".event-photo").forEach(function (slot) {
      var img = slot.querySelector("img");
      if (!img) return;

      function markEmpty() {
        slot.classList.add("is-empty");
        slot.setAttribute("aria-hidden", "true");
      }

      img.addEventListener("error", markEmpty);
      if (img.complete && !img.naturalWidth) markEmpty();

      slot.addEventListener("click", function () {
        if (slot.classList.contains("is-empty")) return;
        openLightbox(img.src, img.alt);
      });
    });

    document.querySelectorAll(".event-gallery").forEach(function (gallery) {
      var slots = gallery.querySelectorAll(".event-photo");
      var filled = gallery.querySelectorAll(".event-photo:not(.is-empty)");
      if (filled.length) return;

      slots.forEach(function (slot, index) {
        if (index > 0) slot.classList.add("is-collapsed");
      });

      var hint = gallery.querySelector(".event-photo.is-empty .event-photo-placeholder");
      if (hint && slots.length > 1) {
        var extra = document.createElement("span");
        extra.className = "event-photo-more";
        extra.textContent = "+" + (slots.length - 1) + " more slots";
        hint.appendChild(extra);
      }
    });
  }

  function openLightbox(src, alt) {
    var existing = document.getElementById("event-lightbox");
    if (existing) existing.remove();

    var lb = document.createElement("div");
    lb.id = "event-lightbox";
    lb.className = "event-lightbox open";
    lb.innerHTML =
      '<button type="button" class="event-lightbox-close" aria-label="Close">&times;</button>' +
      '<img src="' +
      src +
      '" alt="' +
      (alt || "") +
      '">';

    function close() {
      lb.classList.remove("open");
      setTimeout(function () {
        if (lb.parentNode) lb.parentNode.removeChild(lb);
      }, 200);
      document.body.classList.remove("lightbox-open");
    }

    lb.querySelector(".event-lightbox-close").addEventListener("click", close);
    lb.addEventListener("click", function (e) {
      if (e.target === lb) close();
    });
    document.addEventListener(
      "keydown",
      function onKey(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", onKey);
        }
      },
      { once: true }
    );

    document.body.appendChild(lb);
    document.body.classList.add("lightbox-open");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEventPhotos);
  } else {
    initEventPhotos();
  }
})();
