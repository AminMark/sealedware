document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");
  const menuCloseBtn = document.querySelector(".mobile-menu-close");

  if (menuBtn && mobileMenu) {
    function closeMenu() {
      mobileMenu.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("active");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    menuCloseBtn?.addEventListener("click", closeMenu);
  }

  const enquiry = document.querySelector(".enquiry");
  const enquiryForm = document.querySelector(".enquiry-form");
  const enquiryStatus = document.querySelector(".enquiry-status");
  const contactLinks = document.querySelectorAll('a[href="#contact"]');

  function openEnquiry() {
    if (!enquiry) return;

    enquiry.classList.add("is-open");
    enquiry.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      enquiry.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function closeEnquiry() {
    if (!enquiry) return;

    enquiry.classList.remove("is-open");
    enquiry.setAttribute("aria-hidden", "true");
  }

  contactLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openEnquiry();

      if (mobileMenu && menuBtn) {
        mobileMenu.classList.remove("active");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  });

  function setEnquiryStatus(message, isError = false) {
    if (!enquiryStatus) return;

    enquiryStatus.textContent = message;
    enquiryStatus.classList.toggle("is-error", isError);
  }

  enquiryForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!enquiryForm.checkValidity()) {
      enquiryForm.reportValidity();
      return;
    }

    const formData = new FormData(enquiryForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const submitButton = enquiryForm.querySelector(".enquiry-send");

    submitButton.disabled = true;
    setEnquiryStatus("Sending...");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Unable to send enquiry.");
      }

      enquiryForm.reset();
      setEnquiryStatus("Thank you. Your enquiry has been sent.");

      window.setTimeout(() => {
        setEnquiryStatus("");
        closeEnquiry();
      }, 2600);
    } catch (error) {
      setEnquiryStatus(error.message || "Could not send. Please try again or email contact@sealedware.ca.", true);
    } finally {
      submitButton.disabled = false;
    }
  });

  const cards = [...document.querySelectorAll(".work-card")];
  const dots = [...document.querySelectorAll(".mobile-dots button")];
  const workGrid = document.querySelector(".work-grid");
  let currentIndex = 0;

  function showSlide(index) {
    if (!cards.length || !dots.length) return;

    const nextIndex = (index + cards.length) % cards.length;
    const direction = nextIndex >= currentIndex ? "next" : "previous";
    currentIndex = nextIndex;

    cards.forEach((card, cardIndex) => {
      card.classList.remove("slide-next", "slide-previous");
      card.classList.toggle("is-current", cardIndex === currentIndex);

      if (cardIndex === currentIndex) {
        card.classList.add(direction === "next" ? "slide-next" : "slide-previous");
      }
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

        if (Math.abs(distance) < 50) return;
        showSlide(distance > 0 ? currentIndex + 1 : currentIndex - 1);
      },
      { passive: true }
    );
  }

  showSlide(0);

  const modal = document.querySelector(".video-modal");
  const modalVideo = document.querySelector(".modal-video");
  const closeButton = document.querySelector(".video-close");
  const playButtons = document.querySelectorAll(".play-button");

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");

    if (modalVideo) {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  }

  playButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!modal) return;

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      modalVideo?.play().catch(() => {});
    });
  });

  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    closeModal();
    if (mobileMenu && menuBtn) {
      mobileMenu.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });
});
