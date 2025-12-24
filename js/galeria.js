const images = document.querySelectorAll('.gallery-grid img');
let currentIndex = 0;
let slideInterval;

function openLightbox(img) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  currentIndex = [...images].indexOf(img);
  lightboxImg.src = img.src;
  lightbox.style.display = 'flex';

  startSlider();
}

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
  stopSlider();
}

function startSlider() {
  slideInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    document.getElementById('lightbox-img').src = images[currentIndex].src;
  }, 3000);
}

function stopSlider() {
  clearInterval(slideInterval);
}
