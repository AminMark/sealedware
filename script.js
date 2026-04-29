// MOBILE MENU
const menuBtn = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

// VIDEO MODAL
const modal = document.querySelector(".video-modal");
const iframe = modal.querySelector("iframe");

document.querySelectorAll(".thumbnail button").forEach(btn => {
  btn.addEventListener("click", () => {
    iframe.src = btn.dataset.video;
    modal.classList.add("active");
  });
});

modal.addEventListener("click", () => {
  modal.classList.remove("active");
  iframe.src = "";
});
