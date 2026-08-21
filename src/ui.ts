import { Producto, ItemCarrito } from "./tipos.js";
import { formatearSoles, calcularPorcentajeDescuento, escaparTexto } from "./formato.js";

const MONTO_ENVIO_GRATIS = 100;

export const pintarCatalogo = (productos: Producto[], contenedor: HTMLElement): void => {
  if (productos.length === 0) {
    contenedor.innerHTML = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-search fs-1"></i><p class="mt-2">No encontramos productos en esta categoría.</p></div>`;
    return;
  }

  contenedor.innerHTML = productos.map(p => {
    const tieneOferta = p.precioOferta && p.precioOferta < p.precio;
    const precioFinal = tieneOferta ? p.precioOferta! : p.precio;
    const porcentajeAh = tieneOferta ? calcularPorcentajeDescuento(p.precio, p.precioOferta!) : 0;
    const cuotaCalculada = p.cuotasSinInteres ? (precioFinal / p.cuotasSinInteres).toFixed(2) : null;

    return `
      <div class="col d-flex align-items-stretch">
        <div class="card w-100 shadow-sm border-0 card-product p-2 d-flex flex-column">
          <div class="position-relative text-center">
            ${tieneOferta ? `<span class="badge badge-cyber position-absolute top-0 start-0 m-1">-${porcentajeAh}%</span>` : ''}
            <img src="${p.imagen}" class="card-img-top p-2" alt="${escaparTexto(p.nombre)}" style="height: 150px; object-fit: contain;">
          </div>
          
          <div class="card-body p-2 d-flex flex-column flex-grow-1 text-center">
            <small class="text-muted text-uppercase fw-semibold" style="font-size: 0.7rem;">${escaparTexto(p.categoria)}</small>
            <h6 class="card-title fw-bold text-dark text-truncate my-1">${escaparTexto(p.nombre)}</h6>
            
            <div class="my-1">
              ${tieneOferta ? `<span class="text-decoration-line-through text-muted me-1 small">${formatearSoles(p.precio)}</span>` : ''}
              <span class="fs-6 fw-bold text-danger">${formatearSoles(precioFinal)}</span>
            </div>

            ${p.cuotasSinInteres ? `
              <div class="bg-light rounded p-1 mb-2 border border-warning-subtle" style="font-size: 0.7rem;">
                <i class="bi bi-credit-card-fill text-danger"></i> <strong>${p.cuotasSinInteres} cuotas</strong> de S/ ${cuotaCalculada}
              </div>
            ` : '<div class="mb-2" style="height: 24px;"></div>'}

            <button data-accion="agregar" data-id="${p.id}" class="btn btn-outline-danger btn-sm mt-auto w-100 rounded-pill fw-semibold">
              <i class="bi bi-cart-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
};

export const pintarCarrito = (
  carrito: ItemCarrito[],
  listaContenedor: HTMLElement,
  totalElemento: HTMLElement,
  resumenHeader: HTMLElement,
  btnCheckout: HTMLButtonElement,
  totalMonto: number,
  totalUnidades: number
): void => {
  resumenHeader.textContent = `🛒 ${totalUnidades} un. · ${formatearSoles(totalMonto)}`;
  totalElemento.textContent = formatearSoles(totalMonto);

  btnCheckout.disabled = carrito.length === 0;

  const faltaParaEnvio = MONTO_ENVIO_GRATIS - totalMonto;
  const porcentajeProgreso = Math.min(100, Math.round((totalMonto / MONTO_ENVIO_GRATIS) * 100));

  let barraEnvioHTML = '';
  if (totalMonto === 0) {
    barraEnvioHTML = `
      <div class="alert alert-light border py-2 mb-3 small text-center text-muted">
        🚚 Agrega <strong>${formatearSoles(MONTO_ENVIO_GRATIS)}</strong> para obtener <strong>Envío GRATIS</strong>.
      </div>`;
  } else if (faltaParaEnvio > 0) {
    barraEnvioHTML = `
      <div class="mb-3">
        <small class="fw-semibold text-secondary">🚚 Estás a ${formatearSoles(faltaParaEnvio)} del Envío GRATIS</small>
        <div class="progress mt-1" style="height: 8px;">
          <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${porcentajeProgreso}%"></div>
        </div>
      </div>`;
  } else {
    barraEnvioHTML = `
      <div class="alert alert-success py-2 mb-3 small fw-bold text-center">
        🎉 ¡Felicidades! Tienes <strong>ENVÍO GRATIS</strong>.
      </div>`;
  }

  if (carrito.length === 0) {
    listaContenedor.innerHTML = `
      ${barraEnvioHTML}
      <li class="list-group-item border-0 text-muted text-center py-4 fs-6">El carrito está vacío. ¡Aprovecha las ofertas CyberDay!</li>
    `;
    return;
  }

  const itemsHTML = carrito.map(item => {
    const precio = item.producto.precioOferta ?? item.producto.precio;
    return `
      <li class="list-group-item border-0 border-bottom d-flex justify-content-between align-items-center flex-wrap gap-2 py-2 px-0">
        <div class="ms-2 me-auto">
          <div class="fw-semibold text-dark fs-6">${escaparTexto(item.producto.nombre)}</div>
          <small class="text-muted">${formatearSoles(precio)} c/u</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button data-accion="menos" data-id="${item.id}" class="btn btn-sm btn-light border px-2">-</button>
          <span class="fw-bold fs-6">${item.cantidad}</span>
          <button data-accion="mas" data-id="${item.id}" class="btn btn-sm btn-light border px-2">+</button>
          <button data-accion="quitar" data-id="${item.id}" class="btn btn-sm btn-outline-danger ms-2"><i class="bi bi-trash"></i></button>
        </div>
      </li>
    `;
  }).join('');

  listaContenedor.innerHTML = barraEnvioHTML + itemsHTML;
};