const cards = [...document.querySelectorAll(".work-card")];
const dots = [...document.querySelectorAll(".mobile-dots button")];

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-current", cardIndex === index);
    });

    dots.forEach((item, dotIndex) => {
      item.classList.toggle("is-active", dotIndex === index);
    });
  });
});
