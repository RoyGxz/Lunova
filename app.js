// ============================================================
//  LUNOVA — Lógica principal de la app
//  Edita WHATSAPP_NUMBER con tu número real (solo dígitos)
// ============================================================

const WHATSAPP_NUMBER = "51987654321"; // ← Cambia este número

// ---------- Estado del carrito ----------
let carrito = [];

// ---------- Renderizado de productos ----------
function renderProductos(lista) {
  const grid = document.getElementById("productos-grid");
  const sinResultados = document.getElementById("sin-resultados");

  if (lista.length === 0) {
    grid.innerHTML = "";
    sinResultados.style.display = "flex";
    return;
  }

  sinResultados.style.display = "none";

  grid.innerHTML = lista
    .map(
      (p, i) => `
    <article class="card" style="animation-delay:${i * 0.06}s">
      <div class="card-img-wrap">
        <img
          src="${p.imagen}"
          alt="${p.nombre}"
          loading="lazy"
          onerror="this.src='img/placeholder.svg'"
        />
        <span class="card-badge">${p.categoria}</span>
      </div>
      <div class="card-body">
        <h3 class="card-nombre">${p.nombre}</h3>
        <p class="card-desc">${p.descripcion}</p>
        <p class="card-precio">S/ ${p.precio.toFixed(2)}</p>
        <div class="card-btns">
          <button
            class="btn btn-carrito"
            onclick="agregarAlCarrito(${p.id})"
            aria-label="Agregar ${p.nombre} al carrito"
          >
            🛒 Agregar
          </button>
          <button
            class="btn btn-wa"
            onclick="pedirWhatsapp(${p.id})"
            aria-label="Pedir ${p.nombre} por WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.122 1.533 5.855L.057 23.882a.5.5 0 00.611.611l6.124-1.478A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.002-1.37l-.359-.213-3.722.898.912-3.627-.234-.374A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
            Pedir
          </button>
        </div>
      </div>
    </article>
  `
    )
    .join("");
}

// ---------- Categorías ----------
function renderCategorias() {
  const categorias = ["Todos", ...new Set(productos.map((p) => p.categoria))];
  const wrap = document.getElementById("categorias-wrap");

  wrap.innerHTML = categorias
    .map(
      (cat) =>
        `<button class="cat-btn${cat === "Todos" ? " activa" : ""}" data-cat="${cat}">${cat}</button>`
    )
    .join("");

  wrap.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("activa"));
      btn.classList.add("activa");
      filtrar();
    });
  });
}

// ---------- Filtrar y buscar ----------
function filtrar() {
  const q = document.getElementById("buscador").value.toLowerCase().trim();
  const cat = document.querySelector(".cat-btn.activa")?.dataset.cat || "Todos";

  const resultado = productos.filter((p) => {
    const coincideCat = cat === "Todos" || p.categoria === cat;
    const coincideQ =
      !q ||
      p.nombre.toLowerCase().includes(q) ||
      p.descripcion.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q);
    return coincideCat && coincideQ;
  });

  renderProductos(resultado);
}

// ---------- Carrito ----------
function agregarAlCarrito(id) {
  const producto = productos.find((p) => p.id === id);
  if (!producto) return;

  const existente = carrito.find((item) => item.id === id);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  actualizarCarrito();
  mostrarToast(`✓ ${producto.nombre} agregado`);
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  actualizarCarrito();
  renderCarritoModal();
}

function cambiarCantidad(id, delta) {
  const item = carrito.find((i) => i.id === id);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) eliminarDelCarrito(id);
  else {
    actualizarCarrito();
    renderCarritoModal();
  }
}

function actualizarCarrito() {
  const total = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  const badge = document.getElementById("carrito-badge");
  badge.textContent = total;
  badge.style.display = total > 0 ? "flex" : "none";
}

function renderCarritoModal() {
  const cuerpo = document.getElementById("carrito-cuerpo");
  const totalEl = document.getElementById("carrito-total");
  const btnEnviar = document.getElementById("btn-enviar-carrito");

  if (carrito.length === 0) {
    cuerpo.innerHTML = `<div class="carrito-vacio"><span>🛍️</span><p>Tu carrito está vacío</p></div>`;
    totalEl.textContent = "S/ 0.00";
    btnEnviar.style.display = "none";
    return;
  }

  btnEnviar.style.display = "flex";

  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  totalEl.textContent = `S/ ${subtotal.toFixed(2)}`;

  cuerpo.innerHTML = carrito
    .map(
      (item) => `
    <div class="carrito-item">
      <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='img/placeholder.svg'"/>
      <div class="ci-info">
        <p class="ci-nombre">${item.nombre}</p>
        <p class="ci-precio">S/ ${item.precio.toFixed(2)} c/u</p>
        <div class="ci-cantidad">
          <button onclick="cambiarCantidad(${item.id},-1)">−</button>
          <span>${item.cantidad}</span>
          <button onclick="cambiarCantidad(${item.id},1)">+</button>
        </div>
      </div>
      <div class="ci-derecha">
        <p class="ci-subtotal">S/ ${(item.precio * item.cantidad).toFixed(2)}</p>
        <button class="ci-eliminar" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar">✕</button>
      </div>
    </div>
  `
    )
    .join("");
}

function abrirCarrito() {
  renderCarritoModal();
  document.getElementById("modal-carrito").classList.add("abierto");
  document.body.style.overflow = "hidden";
}

function cerrarCarrito() {
  document.getElementById("modal-carrito").classList.remove("abierto");
  document.body.style.overflow = "";
}

// ---------- WhatsApp ----------
function generarMensajeCarrito() {
  const lineas = carrito.map(
    (i) => `• ${i.nombre} x${i.cantidad} — S/ ${(i.precio * i.cantidad).toFixed(2)}`
  );
  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  return (
    `Hola, quiero hacer un pedido en LUNOVA 🌸\n\n` +
    lineas.join("\n") +
    `\n\n*Total: S/ ${total.toFixed(2)}*\n\nTienda: LUNOVA`
  );
}

function enviarCarritoWhatsapp() {
  if (carrito.length === 0) return;
  const msg = encodeURIComponent(generarMensajeCarrito());
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

function pedirWhatsapp(id) {
  const p = productos.find((x) => x.id === id);
  if (!p) return;
  const msg = encodeURIComponent(
    `Hola, quiero pedir:\n\nProducto: ${p.nombre}\nPrecio: S/ ${p.precio.toFixed(2)}\nTienda: LUNOVA 🌸`
  );
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
}

// ---------- Toast ----------
function mostrarToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("visible");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("visible"), 2200);
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  renderCategorias();
  renderProductos(productos);

  document.getElementById("buscador").addEventListener("input", filtrar);

  document.getElementById("btn-carrito").addEventListener("click", abrirCarrito);
  document.getElementById("btn-cerrar-modal").addEventListener("click", cerrarCarrito);
  document.getElementById("btn-enviar-carrito").addEventListener("click", enviarCarritoWhatsapp);

  document.getElementById("modal-carrito").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) cerrarCarrito();
  });
});
