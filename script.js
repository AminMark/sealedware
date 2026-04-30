document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
      });
    });
  }

  const cards = [...document.querySelectorAll(".work-card")];
  const dots = [...document.querySelectorAll(".mobile-dots button")];
  const workGrid = document.querySelector(".work-grid");

  let currentIndex = 0;

  function showSlide(index) {
    if (!cards.length || !dots.length) return;

    currentIndex = (index + cards.length) % cards.length;

    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-current", cardIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  if (workGrid && cards.length) {
    let startX = 0;

    workGrid.addEventListener(
      "touchstart",
      (event) => {
        startX = event.touches[0].clientX;
      },
      { passive: true }
    );

    workGrid.addEventListener(
      "touchend",
      (event) => {
        const endX = event.changedTouches[0].clientX;
        const distance = startX - endX;

        if (Math.abs(distance) > 50) {
          if (distance > 0) {
            showSlide(currentIndex + 1);
          } else {
            showSlide(currentIndex - 1);
          }
        }
      },
      { passive: true }
    );
  }

  showSlide(0);
});
