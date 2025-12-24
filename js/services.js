/* js/services.js */
const DEFAULT_SERVICES_KEY = 'novatech_services_v1';
const CART_KEY = 'novatech_cart_v1';

// Servicios por defecto
const defaultServices = [
{
  id: 1,
  name: "Arreglos Musicales",
  description: "Arreglos musicales personalizados que realzan tu proyecto, adaptados al estilo, formato y nivel de cada agrupación.",
  features: [
    "Adaptación a diferentes estilos musicales",
    "Arreglos para coros, bandas y ensambles",
    "Ajuste de tonalidad y estructura"
  ],
  price: "A convenir",
  img: "img/servicio1.PNG"
}
,
  {
  id: 2,
  name: "Piano Profesional",
  description: "Servicio de pianista profesional para eventos, grabaciones y presentaciones en vivo, con interpretación musical de alta calidad.",
  features: [
    "Eventos sociales y corporativos",
    "Acompañamiento a solistas y agrupaciones",
    "Amplio repertorio musical"
  ],
  price: "A convenir",
  img: "img/servicio2.PNG"
}
,
  {
  id: 3,
  name: "Transcripción de Partituras",
  description: "Transcripción precisa de audio a partitura, ideal para músicos, estudiantes y agrupaciones que buscan claridad musical.",
  features: [
    "Audio a partitura",
    "Leadsheets y partituras completas",
    "Formato digital listo para impresión"
  ],
  price: "A convenir",
  img: "img/servicio3.PNG"
}
,
{
  id: 4,
  name: "Servicio de Sonido",
  description: "Servicio de sonido profesional para eventos, garantizando una experiencia auditiva clara y equilibrada.",
  features: [
    "Montaje y operación de sonido",
    "Eventos musicales y sociales",
    "Equipos confiables y soporte técnico"
  ],
  price: "A convenir",
  img: "img/servicio4.PNG"
}
,
  
];

// Funciones de storage
function readServices() {
  let services = JSON.parse(localStorage.getItem(DEFAULT_SERVICES_KEY));
  if (!services || !Array.isArray(services) || services.length === 0) {
    services = defaultServices;
    localStorage.setItem(DEFAULT_SERVICES_KEY, JSON.stringify(services));
    return services;
  }

  // Merge: si hay servicios guardados pero les faltan campos, los completamos desde defaultServices
  services = services.map(s => {
    const def = defaultServices.find(d => d.id === s.id) || {};
    return {
      id: s.id ?? def.id,
      name: s.name ?? def.name ?? 'Servicio',
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

// Actualiza contador de carrito
function updateCartCountUI() {
  const count = readCart().reduce((acc, item) => acc + item.quantity, 0);
  document.querySelectorAll(".contador").forEach(el => el.textContent = count);
}

// Inicializa la página de servicios
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

  // Inyecta servicios
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
      modalSubtitle.textContent = "Plan empresarial";
      modalFeatures.innerHTML = "<ul>" + s.features.map(f => `<li>${f}</li>`).join("") + "</ul>";
      modalPrice.textContent = `$${s.price.toLocaleString()}`;
      modalStock.textContent = s.stock;
      modalQty.value = 1;
      overlay.classList.add("active");

      addToCartBtn.onclick = () => {
        addToCart(s.id, parseInt(modalQty.value));
        overlay.classList.remove("active");
        alert("Producto agregado al carrito!");
      };
    });
    grid.appendChild(card);
  });

  closeModalBtn.addEventListener("click", () => overlay.classList.remove("active"));
  overlay.addEventListener("click", (e) => { if(e.target === overlay) overlay.classList.remove("active"); });

  updateCartCountUI();
}


// Inicializa funciones dependiendo de la página actual
document.addEventListener("DOMContentLoaded", () => {
  // Si la página tiene la sección de servicios
  if (document.getElementById("servicesGrid")) {
    initServicesPage();
  }

  // Si la página tiene el formulario de contacto
  if (document.getElementById("contactForm")) {
    initContactPage();
  }

});

// ======================
//   CONTACTO
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
        successMsg.textContent = '✅ Mensaje enviado correctamente. Gracias por contactarnos.';
        show(successMsg);
        form.reset();
      } else {
        successMsg.textContent = '❌ Error al enviar el mensaje: ' + (result.message || '');
        show(successMsg);
      }
    } catch (error) {
      console.error('Error de red:', error);
      successMsg.textContent = '❌ No se pudo conectar con el servidor. Verifica tu conexión.';
      show(successMsg);
    }
  });
}