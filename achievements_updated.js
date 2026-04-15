/* ============================================================
   achievements.js – Kovid Dutt Sharma Portfolio
   Floating Achievements Slideshow (Top-Right Corner)
   ============================================================ */

(function () {
  "use strict";

  /* ── Config ─────────────────────────────────────────────── */
  const TOTAL = 15;
  const AUTO_MS = 3500;

  const imgs = Array.from({ length: TOTAL }, (_, i) => ({
    src: `achievements/Kovid's achievements_${i + 1}.jpg`,
    alt: `Kovid's achievement ${i + 1}`,
  }));

  /* ── State ──────────────────────────────────────────────── */
  let currentIdx = 0;
  let timer = null;
  let imgEls = [];
  let dotEls = [];
  let lbIdx = 0;
  let lb, lbImg, lbCaption;

  /* ── Build Widget ───────────────────────────────────────── */
  function buildCard() {
    const mount = document.getElementById("achievementsMount");

    if (!mount) {
      console.warn("[achievements] #achievementsMount not found");
      return false;
    }

    mount.innerHTML = "";

    const widget = document.createElement("section");
    widget.className = "achievements-widget";
    widget.id = "achievementsWidget";
    widget.setAttribute("aria-label", "achievements");

    widget.innerHTML = `
      <div class="achievements-header">
        <h2>achievements</h2>
      </div>

      <div class="achievements-slider" id="achievementsSlider" tabindex="0"
           aria-roledescription="carousel"
           aria-label="achievement certificates slideshow">

        <div class="achievements-track" id="achievementsTrack"
             aria-live="polite"></div>

        <button class="achievements-nav achievements-prev"
                id="achievementsPrev"
                type="button"
                aria-label="Previous achievement">
          <span aria-hidden="true">&#10094;</span>
        </button>

        <button class="achievements-nav achievements-next"
                id="achievementsNext"
                type="button"
                aria-label="Next achievement">
          <span aria-hidden="true">&#10095;</span>
        </button>
      </div>

      <div class="achievements-dots"
           id="achievementsDots"
           role="tablist"
           aria-label="achievement slide indicators"></div>
    `;

    mount.appendChild(widget);

    const track = document.getElementById("achievementsTrack");
    const dotsContainer = document.getElementById("achievementsDots");

    /* Create Slides */
    imgEls = imgs.map((item, idx) => {
      const figure = document.createElement("figure");
      figure.className =
        "achievement-slide" + (idx === 0 ? " is-active" : "");

      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.alt;
      img.loading = idx === 0 ? "eager" : "lazy";

      figure.appendChild(img);
      figure.addEventListener("click", () => openLightbox(idx));
      track.appendChild(figure);

      return figure;
    });

    /* Create Dots */
    dotEls = imgs.map((_, idx) => {
      const dot = document.createElement("button");
      dot.className =
        "achievements-dot" + (idx === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Go to achievement ${idx + 1}`);
      dot.addEventListener("click", () => {
        goTo(idx);
        resetTimer();
      });
      dotsContainer.appendChild(dot);
      return dot;
    });

    document
      .getElementById("achievementsPrev")
      .addEventListener("click", () => {
        goTo(currentIdx - 1);
        resetTimer();
      });

    document
      .getElementById("achievementsNext")
      .addEventListener("click", () => {
        goTo(currentIdx + 1);
        resetTimer();
      });

    return true;
  }

  /* ── Slide Logic ────────────────────────────────────────── */
  function goTo(idx) {
    imgEls[currentIdx].classList.remove("is-active");
    dotEls[currentIdx].classList.remove("is-active");

    currentIdx = (idx + TOTAL) % TOTAL;

    imgEls[currentIdx].classList.add("is-active");
    dotEls[currentIdx].classList.add("is-active");
  }

  function startTimer() {
    timer = setInterval(() => goTo(currentIdx + 1), AUTO_MS);
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  function pauseTimer() {
    clearInterval(timer);
  }

  function resumeTimer() {
    startTimer();
  }

  /* ── Lightbox ───────────────────────────────────────────── */
  function buildLightbox() {
    lb = document.createElement("div");
    lb.className = "achievements-lightbox";
    lb.innerHTML = `
      <button class="achievements-lightbox-close"
              aria-label="Close">&times;</button>
      <img src="" alt="">
      <p class="achievements-lightbox-caption"></p>
    `;

    document.body.appendChild(lb);

    lbImg = lb.querySelector("img");
    lbCaption = lb.querySelector(
      ".achievements-lightbox-caption"
    );

    lb.querySelector(
      ".achievements-lightbox-close"
    ).addEventListener("click", closeLightbox);

    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(idx) {
    lbIdx = idx;
    showLightbox();
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    pauseTimer();
  }

  function closeLightbox() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    resumeTimer();
  }

  function showLightbox() {
    lbImg.src = imgs[lbIdx].src;
    lbImg.alt = imgs[lbIdx].alt;
    lbCaption.textContent = `Achievement ${lbIdx + 1} · ${lbIdx + 1} / ${TOTAL}`;
  }

  /* ── Init ───────────────────────────────────────────────── */
  function init() {
    if (!buildCard()) return;
    buildLightbox();
    startTimer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
