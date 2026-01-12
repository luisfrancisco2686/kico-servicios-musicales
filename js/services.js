/* js/services.js */
const DEFAULT_SERVICES_KEY = 'novatech_services_v1';
const CART_KEY = 'novatech_cart_v1';

// Default services
const defaultServices = [
{
  id: 1,
  name: "Musical Arrangements",
  description: "Custom musical arrangements that enhance your project, adapted to the style, format, and level of each group.",
  features: [
    "Adaptation to different musical styles",
    "Arrangements for choirs, bands, and ensembles",
    "Key and structure adjustments"
  ],
  price: "To be agreed",
  img: "img/servicio1.png"
}
,
{
  id: 2,
  name: "Professional Piano",
  description: "Professional pianist service for events, recordings, and live performances with high-quality musical interpretation.",
  features: [
    "Social and corporate events",
    "Accompaniment for soloists and groups",
    "Wide musical repertoire"
  ],
  price: "To be agreed",
  img: "img/servicio2.png"
}
,
{
  id: 3,
  name: "Sheet Music Transcription",
  description: "Accurate audio-to-sheet transcription, ideal for musicians, students, and groups seeking musical clarity.",
  features: [
    "Audio to sheet music",
    "Leadsheets and full scores",
    "Digital format ready for printing"
  ],
  price: "To be agreed",
  img: "img/servicio3.png"
}
,
{
  id: 4,
  name: "Sound Service",
  description: "Professional sound service for events, ensuring a clear and balanced listening experience.",
  features: [
    "Sound setup and operation",
    "Musical and social events",
    "Reliable equipment and technical support"
  ],
  price: "To be agreed",
  img: "img/servicio4.png"
}
,
];

// Storage functions
function readServices() {
  let services = JSON.parse(localStorage.getItem(DEFAULT_SERVICES_KEY));
  if (!services || !Array.isArray(services) || services.length === 0) {
    services = defaultServices;
    localStorage.setItem(DEFAULT_SERVICES_KEY, JSON.stringify(services));
    return services;
  }

  services = services.map(s => {
    const def = defaultServices.find(d => d.id === s.id) || {};
    return {
      id: s.id ?? def.id,
      name: s.name ?? def.name ?? 'Service',
      description: s.description ?? def.description ?? '',
      features: s.features ?? def.features ?? [],
      price: s.price ?? def.price ?? 0,
      stock: s.stock ?? def.stock ?? 0,
      img: s.img ?? def.img ?? 'img/placeholder.png'
    };
  });

  localStorage.setItem(DEFAULT_SERVICES_KEY, JSON.stringify(services));
  return services;
}

function readCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(serviceId, quantity) {
  const cart = readCart();
  const existing = cart.find(item => item.id === serviceId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: serviceId, quantity });
  }
  saveCart(cart);
  updateCartCountUI();
}

// Update cart counter
function updateCartCountUI() {
  const count = readCart().reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll(".contador").forEach(el => el.textContent = count);
}

// Initialize services page
function initServicesPage() {
  const services = readServices();
  const grid = document.getElementById("servicesGrid");
  const overlay = document.getElementById("serviceOverlay");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalFeatures = document.getElementById("modalFeatures");
  const modalPrice = document.getElementById("modalPrice");
  const modalStock = document.getElementById("modalStock");
  const modalQty = document.getElementById("modalQty");
  const addToCartBtn = document.getElementById("addToCart");
  const closeModalBtn = document.getElementById("closeModal");

  grid.innerHTML = "";
  services.forEach(s => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <img src="${s.img}" alt="${s.name}" class="icon-img"
          onerror="this.onerror=null; this.src='img/placeholder.png';">
      <h3>${s.name}</h3>
      <p>${s.description ?? ''}</p>
    `;
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      modalImg.src = s.img;
      modalTitle.textContent = s.name;
      modalSubtitle.textContent = "Business plan";
      modalFeatures.innerHTML = "<ul>" + s.features.map(f => `<li>${f}</li>`).join("") + "</ul>";
      modalPrice.textContent = `$${s.price.toLocaleString()}`;
      modalStock.textContent = s.stock;
      modalQty.value = 1;
      overlay.classList.add("active");

      addToCartBtn.onclick = () => {
        addToCart(s.id, parseInt(modalQty.value));
        overlay.classList.remove("active");
        alert("Product added to cart!");
      };
    });
    grid.appendChild(card);
  });

  closeModalBtn.addEventListener("click", () => overlay.classList.remove("active"));
  overlay.addEventListener("click", (e) => { if(e.target === overlay) overlay.classList.remove("active"); });

  updateCartCountUI();
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("servicesGrid")) {
    initServicesPage();
  }

  if (document.getElementById("contactForm")) {
    initContactPage();
  }
});

// ======================
//   CONTACT
// ======================
function initContactPage() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const errNombres = document.getElementById('errNombres');
  const errApellidos = document.getElementById('errApellidos');
  const errEmail = document.getElementById('errEmail');
  const errPais = document.getElementById('errPais');
  const errMensaje = document.getElementById('errMensaje');
  const successMsg = document.getElementById('successMsg');

  const show = (el) => el && (el.style.display = 'block');
  const hide = (el) => el && (el.style.display = 'none');

  hide(errNombres);
  hide(errApellidos);
  hide(errEmail);
  hide(errPais);
  hide(errMensaje);
  hide(successMsg);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    hide(errNombres);
    hide(errApellidos);
    hide(errEmail);
    hide(errPais);
    hide(errMensaje);
    hide(successMsg);

    const nombres = form.nombres.value.trim();
    const apellidos = form.apellidos.value.trim();
    const email = form.email.value.trim();
    const empresa = form.empresa.value.trim();
    const pais = form.pais.value.trim();
    const mensaje = form.mensaje.value.trim();

    let valid = true;

    if (nombres.length < 2) { show(errNombres); valid = false; }
    if (apellidos.length < 2) { show(errApellidos); valid = false; }
    if (!/\S+@\S+\.\S+/.test(email)) { show(errEmail); valid = false; }
    if (!pais) { show(errPais); valid = false; }
    if (mensaje.length < 1) { show(errMensaje); valid = false; }

    if (!valid) return;

    try {
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombres, apellidos, email, empresa, pais, mensaje }),
      });

      const result = await response.json();

      if (result.success) {
        successMsg.textContent = '✅ Message sent successfully. Thank you for contacting us.';
        show(successMsg);
        form.reset();
      } else {
        successMsg.textContent = '❌ Error sending message: ' + (result.message || '');
        show(successMsg);
      }
    } catch (error) {
      console.error('Network error:', error);
      successMsg.textContent = '❌ Unable to connect to the server. Check your connection.';
      show(successMsg);
    }
  });
}
