document.addEventListener("DOMContentLoaded", () => {
  // MOBILE MENU
  const menuBtn = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.remove("active"));
    });
  }

  // FEATURED WORK MOBILE SLIDER
  const cards = [...document.querySelectorAll(".work-card")];
  const dots = [...document.querySelectorAll(".mobile-dots button")];
  const workGrid = document.querySelector(".work-grid");

  let currentIndex = 0;

  function showSlide(index) {
    if (!cards.length || !dots.length) return;

    currentIndex = (index + cards.length) % cards.length;

    cards.forEach((card, i) => {
      card.classList.toggle("is-current", i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentIndex);
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
    });
  });

  // Swipe support
  if (workGrid && cards.length) {
    let startX = 0;
    let endX = 0;

    workGrid.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    workGrid.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;

      const distance = startX - endX;

      if (Math.abs(distance) > 50) {
        if (distance > 0) {
          showSlide(currentIndex + 1); // swipe left
        } else {
          showSlide(currentIndex - 1); // swipe right
        }
      }
    });
  }

  showSlide(0);
});
