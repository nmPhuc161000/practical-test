/**
 * FILE: custom-scripts.js
 * Mô tả: Xử lý popup Nutritional Information và Accordion FAQ trên trang sản phẩm
 * Tác giả: [Tên bạn hoặc để trống]
 * Ngày tạo: Tháng 1/2026
 */

document.addEventListener("DOMContentLoaded", function () {
  // PHẦN 1: POPUP NUTRITIONAL INFORMATION

  // Lấy các phần tử cần thiết
  const nutritionTrigger = document.querySelector(
    ".main_product-nutrition-info"
  );
  const popupOuter = document.querySelector(".nutrition_popup-outer");
  const closeBtn = document.querySelector(".nutrition_popup-close");

  // Kiểm tra xem các phần tử có tồn tại không để tránh lỗi
  if (!nutritionTrigger || !popupOuter) {
    console.warn("Không tìm thấy trigger hoặc popup Nutritional Information");
    return; // Thoát sớm nếu thiếu phần tử
  }

  // Hàm mở popup
  function openPopup() {
    popupOuter.style.display = "flex";
    // Optional: Ngăn scroll nền nếu cần (bỏ comment nếu muốn)
    // document.body.style.overflow = "hidden";
  }

  // Hàm đóng popup chung
  function closePopup() {
    popupOuter.style.display = "none";
    // Optional: Trả lại scroll nếu đã chặn
    // document.body.style.overflow = "";
  }

  // MỞ popup khi click vào "Nutritional Information"
  nutritionTrigger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation(); // Ngăn sự kiện lan ra ngoài
    openPopup();
  });

  // ĐÓNG bằng nút X (hình close)
  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Ngăn lan truyền sự kiện
      closePopup();
    });
  }

  // ĐÓNG khi click bên ngoài vùng nội dung popup
  popupOuter.addEventListener("click", function (e) {
    if (e.target === popupOuter) {
      // Chỉ đóng nếu click đúng vào lớp nền
      closePopup();
    }
  });

  // ĐÓNG bằng phím ESC (rất tiện lợi cho người dùng)
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popupOuter.style.display === "flex") {
      closePopup();
    }
  });

  // PHẦN 2: ACCORDION Product selector

  const productBlocks = document.querySelectorAll(".product-selector_block");

  // Thêm sự kiện click cho mỗi block
  productBlocks.forEach((block) => {
    block.addEventListener("click", function () {
      // Xóa class active từ tất cả các block
      productBlocks.forEach((item) => {
        item.classList.remove("active");
      });

      // Thêm class active vào block được click
      this.classList.add("active");
    });
  });

  const tabBlocks = document.querySelectorAll(".product_tab-block");

  tabBlocks.forEach((tab) => {
    const thumb = tab.querySelector(".product_tab-thumb");
    const content = tab.querySelector(".product_tab-content");

    // Khởi tạo ban đầu
    if (!tab.classList.contains("active")) {
      content.style.maxHeight = "0px";
      content.style.overflow = "hidden";
      content.style.transition = "max-height 0.3s ease, padding 0.3s ease";
    }

    thumb.addEventListener("click", function () {
      const isActive = tab.classList.contains("active");

      // Xử lý tab hiện tại
      if (!isActive) {
        tab.classList.add("active");
        // Hiển thị trước khi tính toán chiều cao
        content.style.display = "block";
        // Đợi một chút để browser render trước khi lấy chiều cao
        requestAnimationFrame(() => {
          content.style.maxHeight = content.scrollHeight + "px";
          content.style.paddingTop = "15px";
          content.style.paddingBottom = "15px";
        });
      } else {
        // Reset height trước khi ẩn
        content.style.maxHeight = "0px";
        content.style.paddingTop = "0";
        content.style.paddingBottom = "0";

        // Đợi transition kết thúc rồi mới ẩn hoàn toàn
        setTimeout(() => {
          content.style.display = "none";
          tab.classList.remove("active");
        }, 300); // 300ms = thời gian transition
      }
    });
  });

  // PHẦN 3: ACCORDION FAQ (Frequently Asked Questions)

  // Lấy tất cả các tiêu đề FAQ (các phần tử có thể click)
  const faqBoxes = document.querySelectorAll(".product_faq-box");

  faqBoxes.forEach((box) => {
    const content = box.querySelector(".product_faq-content");
    const thumb = box.querySelector(".product_faq-thumb");

    // Đảm bảo content bị ẩn
    content.style.display = "none";
    content.style.overflow = "hidden";
    content.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
    content.style.maxHeight = "0";
    content.style.opacity = "0";

    // Thêm sự kiện click
    thumb.addEventListener("click", function () {
      const isActive = box.classList.contains("active");

      if (!isActive) {
        // Mở FAQ này
        box.classList.add("active");
        content.style.display = "block";
        // Tính chiều cao thực tế
        const contentHeight = content.scrollHeight;
        content.style.maxHeight = contentHeight + "px";
        content.style.opacity = "1";
      } else {
        // Đóng FAQ này
        box.classList.remove("active");
        content.style.maxHeight = "0";
        content.style.opacity = "0";
        // Ẩn hoàn toàn sau khi animation kết thúc
        setTimeout(() => {
          if (!box.classList.contains("active")) {
            content.style.display = "none";
          }
        }, 300);
      }
    });
  });

  // Phần 5: Video Carousel
  // Lấy các phần tử cần thiết
  const carouselContainer = document.querySelector(".product_ugc-container");
  const slickTrack = carouselContainer.querySelector(".slick-track");
  const slickSlides = Array.from(
    carouselContainer.querySelectorAll(".slick-slide")
  );
  const prevButton = carouselContainer.querySelector(".slick-prev");
  const nextButton = carouselContainer.querySelector(".slick-next");
  const customPrevButton = document.querySelector(".product_carousel-prev");
  const customNextButton = document.querySelector(".product_carousel-next");
  const dotsContainer = carouselContainer.querySelector(".slick-dots");
  const dots = Array.from(dotsContainer.querySelectorAll("li"));

  // Biến trạng thái
  let currentIndex = 0;
  const slidesPerView = 4; // Số video hiển thị cùng lúc
  const totalSlides = slickSlides.length;
  const totalGroups = Math.ceil(totalSlides / slidesPerView);
  let isAnimating = false;
  const animationDuration = 300; // ms

  // Thêm CSS cho animation
  addAnimationCSS();

  // Khởi tạo trạng thái ban đầu
  updateButtonStates();

  // Sự kiện click cho nút tùy chỉnh
  customPrevButton.addEventListener("click", () => {
    if (!isAnimating && currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
  });

  customNextButton.addEventListener("click", () => {
    if (!isAnimating && currentIndex < totalSlides - slidesPerView) {
      moveToSlide(currentIndex + 1);
    }
  });

  // Sự kiện click cho nút slick mặc định
  prevButton.addEventListener("click", () => {
    if (!isAnimating && currentIndex > 0) {
      moveToSlide(currentIndex - 1);
    }
  });

  nextButton.addEventListener("click", () => {
    if (!isAnimating && currentIndex < totalSlides - slidesPerView) {
      moveToSlide(currentIndex + 1);
    }
  });

  // Hàm di chuyển slide với animation
  function moveToSlide(newIndex) {
    if (isAnimating) return;

    isAnimating = true;
    currentIndex = newIndex;

    // Tính toán vị trí mới
    const slideWidth = 310; // Chiều rộng mỗi slide
    const translateX = -currentIndex * slideWidth;

    // Thêm class animation
    slickTrack.style.transition = `transform ${animationDuration}ms ease-in-out`;
    slickTrack.style.transform = `translate3d(${translateX}px, 0px, 0px)`;

    // Cập nhật trạng thái slides
    updateSlidesState();

    // Cập nhật dots position
    updateDotsPosition();

    // Cập nhật trạng thái nút
    updateButtonStates();

    // Kết thúc animation
    setTimeout(() => {
      slickTrack.style.transition = "";
      isAnimating = false;
    }, animationDuration);
  }

  // Hàm cập nhật trạng thái slides
  function updateSlidesState() {
    slickSlides.forEach((slide, index) => {
      const isActive =
        index >= currentIndex && index < currentIndex + slidesPerView;
      const isCurrent = index === currentIndex;

      // Cập nhật class
      slide.classList.toggle("slick-active", isActive);
      slide.classList.toggle("slick-current", isCurrent);

      // Cập nhật aria-hidden
      slide.setAttribute("aria-hidden", !isActive);

      // Cập nhật tabindex
      if (isActive) {
        slide.removeAttribute("tabindex");
      } else {
        slide.setAttribute("tabindex", "-1");
      }
    });
  }

  // Hàm cập nhật vị trí dots (quan trọng)
  function updateDotsPosition() {
    // Tính toán dot active dựa trên currentIndex
    const activeDotIndex = Math.floor(currentIndex / slidesPerView);

    // Ẩn tất cả dots trước
    dots.forEach((dot) => {
      dot.style.display = "none";
    });

    // Chỉ hiển thị một số dots nhất định (giống như carousel)
    const dotsToShow = Math.min(3, totalGroups); // Hiển thị tối đa 3 dots
    let startDot = 0;

    // Tính toán dots nào nên hiển thị
    if (totalGroups > dotsToShow) {
      if (activeDotIndex >= totalGroups - Math.floor(dotsToShow / 2)) {
        startDot = totalGroups - dotsToShow;
      } else if (activeDotIndex > Math.floor(dotsToShow / 2)) {
        startDot = activeDotIndex - Math.floor(dotsToShow / 2);
      }
    }

    // Hiển thị các dots
    for (let i = startDot; i < startDot + dotsToShow && i < totalGroups; i++) {
      if (dots[i]) {
        dots[i].style.display = "inline-block";

        // Cập nhật class active
        dots[i].classList.toggle("slick-active", i === activeDotIndex);

        // Cập nhật button attributes
        const button = dots[i].querySelector("button");
        if (button) {
          button.setAttribute("tabindex", i === activeDotIndex ? "0" : "-1");
          button.setAttribute(
            "aria-selected",
            i === activeDotIndex ? "true" : "false"
          );

          // Cập nhật aria-label
          const slideStart = i * slidesPerView + 1;
          const slideEnd = Math.min((i + 1) * slidesPerView, totalSlides);
          button.setAttribute(
            "aria-label",
            `Group ${i + 1}: slides ${slideStart}-${slideEnd} of ${totalSlides}`
          );
        }
      }
    }

    // Nếu có nhiều hơn dotsToShow groups, thêm indicator "..."
    if (totalGroups > dotsToShow) {
      // Xóa các dots indicator cũ (nếu có)
      const existingIndicators =
        dotsContainer.querySelectorAll(".dots-indicator");
      existingIndicators.forEach((ind) => ind.remove());

      // Thêm indicator ở đầu nếu cần
      if (startDot > 0) {
        const startIndicator = document.createElement("li");
        startIndicator.className = "dots-indicator";
        startIndicator.innerHTML = "<span>...</span>";
        dotsContainer.insertBefore(startIndicator, dots[startDot]);
      }

      // Thêm indicator ở cuối nếu cần
      if (startDot + dotsToShow < totalGroups) {
        const endIndicator = document.createElement("li");
        endIndicator.className = "dots-indicator";
        endIndicator.innerHTML = "<span>...</span>";
        if (dots[startDot + dotsToShow - 1]) {
          dots[startDot + dotsToShow - 1].after(endIndicator);
        }
      }
    }
  }

  // Hàm cập nhật trạng thái nút
  function updateButtonStates() {
    // Nút prev
    if (currentIndex === 0) {
      prevButton.classList.add("slick-disabled");
      prevButton.setAttribute("aria-disabled", "true");
      customPrevButton.classList.add("disabled");
    } else {
      prevButton.classList.remove("slick-disabled");
      prevButton.setAttribute("aria-disabled", "false");
      customPrevButton.classList.remove("disabled");
    }

    // Nút next
    if (currentIndex >= totalSlides - slidesPerView) {
      nextButton.classList.add("slick-disabled");
      nextButton.setAttribute("aria-disabled", "true");
      customNextButton.classList.add("disabled");
    } else {
      nextButton.classList.remove("slick-disabled");
      nextButton.setAttribute("aria-disabled", "false");
      customNextButton.classList.remove("disabled");
    }
  }

  // Thêm sự kiện click cho dots
  dots.forEach((dot, index) => {
    const button = dot.querySelector("button");
    if (button) {
      button.addEventListener("click", () => {
        if (!isAnimating) {
          moveToSlide(index * slidesPerView);
        }
      });
    }
  });

  // Thêm CSS cho animation và dots
  function addAnimationCSS() {
    const style = document.createElement("style");
    style.textContent = `
            .slick-track {
                transition: transform 0.3s ease-in-out !important;
            }
            
            .product_carousel-prev.disabled,
            .product_carousel-next.disabled {
                opacity: 0.3;
                cursor: not-allowed;
            }
            
            .slick-dots {
                display: flex !important;
                justify-content: center;
                margin-top: 20px;
                transition: all 0.3s ease;
            }
            
            .slick-dots li {
                margin: 0 5px;
                transition: all 0.3s ease;
            }
            
            .slick-dots li button {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background: #eee;
                border: 2px solid #ddd;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .slick-dots li.slick-active button {
                background: #333;
                border-color: #333;
                color: white;
            }
            
            .dots-indicator {
                display: inline-block !important;
                margin: 0 5px;
                color: #666;
                line-height: 30px;
            }
            
            /* Smooth transition for slides */
            .slick-slide {
                transition: opacity 0.3s ease;
            }
            
            .slick-slide:not(.slick-active) {
                opacity: 0.7;
            }
            
            .slick-slide.slick-active {
                opacity: 1;
            }
        `;
    document.head.appendChild(style);
  }

  // Thêm sự kiện play/pause cho video
  const playButtons = carouselContainer.querySelectorAll(".product_ugc-play");
  playButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const video = this.closest(".product_ugc-video").querySelector("video");
      if (video.paused) {
        video.play();
        this.style.opacity = "0";
      } else {
        video.pause();
        this.style.opacity = "1";
      }
    });
  });

  // Tự động pause video khi chuyển slide
  const videoObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const slide = mutation.target;
        if (!slide.classList.contains("slick-active")) {
          const video = slide.querySelector("video");
          if (video && !video.paused) {
            video.pause();
            const playButton = slide.querySelector(".product_ugc-play");
            if (playButton) playButton.style.opacity = "1";
          }
        }
      }
    });
  });

  // Theo dõi thay đổi class của slides
  slickSlides.forEach((slide) => {
    videoObserver.observe(slide, { attributes: true });
  });

  // Khởi tạo dots position
  updateDotsPosition();

  // Thêm sự kiện resize để xử lý responsive
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      updateDotsPosition();
    }, 250);
  });

  // Touch/swipe support cho mobile
  let touchStartX = 0;
  let touchEndX = 0;

  slickTrack.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  slickTrack.addEventListener(
    "touchend",
    (e) => {
      if (isAnimating) return;

      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;

      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left - next
        if (currentIndex < totalSlides - slidesPerView) {
          moveToSlide(currentIndex + 1);
        }
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right - prev
        if (currentIndex > 0) {
          moveToSlide(currentIndex - 1);
        }
      }
    },
    { passive: true }
  );

  // PHẦN 6: Open/CLOSE Review Form
  const toggleBtn = document.querySelector(".jdgm-write-rev-link");
  const formWrapper = document.querySelector(".jdgm-form-wrapper");

  if (!toggleBtn || !formWrapper) return;

  // Thiết lập ban đầu
  formWrapper.style.overflow = "hidden";
  formWrapper.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
  formWrapper.style.maxHeight = "0";
  formWrapper.style.opacity = "0";
  formWrapper.style.display = "none"; // Ẩn ban đầu

  function openForm() {
    // Hiển thị trước khi tính toán chiều cao
    formWrapper.style.display = "block";
    formWrapper.style.opacity = "0";

    // Đợi một chút để browser render
    requestAnimationFrame(() => {
      // Lấy chiều cao thực tế
      const height = formWrapper.scrollHeight;

      // Áp dụng animation
      formWrapper.style.maxHeight = height + "px";
      formWrapper.style.opacity = "1";

      // Cập nhật trạng thái button
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.textContent = "Cancel review";

      // Sau khi animation hoàn thành, reset max-height để form có thể co giãn tự nhiên
      setTimeout(() => {
        formWrapper.style.maxHeight = "none";
      }, 300); // 300ms = thời gian transition
    });
  }

  function closeForm() {
    // Lưu lại chiều cao hiện tại trước khi ẩn
    const currentHeight = formWrapper.scrollHeight;
    formWrapper.style.maxHeight = currentHeight + "px";
    formWrapper.style.opacity = "1";

    // Đợi một frame để browser áp dụng
    requestAnimationFrame(() => {
      // Bắt đầu animation đóng
      formWrapper.style.maxHeight = "0";
      formWrapper.style.opacity = "0";

      // Cập nhật trạng thái button
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.textContent = "Write a review";

      // Đợi transition kết thúc rồi mới ẩn hoàn toàn
      setTimeout(() => {
        formWrapper.style.display = "none";
      }, 300); // 300ms = thời gian transition
    });
  }

  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeForm();
    } else {
      openForm();
      // scroll nhẹ xuống form cho user thấy (có delay để chờ form mở)
      setTimeout(() => {
        formWrapper.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 350); // Delay 350ms để form mở xong
    }
  });

  // Bắt sự kiện nút Cancel review trong form
  document.addEventListener("click", function (e) {
    const cancelBtn = e.target.closest(".jdgm-cancel-rev");
    if (!cancelBtn) return;

    e.preventDefault();
    closeForm();
  });
});
