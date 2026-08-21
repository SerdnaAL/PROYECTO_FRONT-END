import { Producto } from "./tipos.js";

export function crearTarjetaProducto(p: Producto): string {
  const tieneDescuento = p.precioOferta && p.precioOferta < p.precio;
  const precioFinal = tieneDescuento ? p.precioOferta : p.precio;

  return `
    <div class="col">
      <div class="card h-100 shadow-sm card-product border-0">
        ${tieneDescuento ? '<span class="badge bg-danger position-absolute top-0 start-0 m-2 fs-6">🔥 CYBER</span>' : ''}
        <img src="${p.imagen}" class="card-img-top p-3" alt="${p.nombre}" style="height: 180px; object-fit: contain;">
        <div class="card-body d-flex flex-column text-center">
          <small class="text-muted text-uppercase mb-1">${p.categoria}</small>
          <h6 class="card-title fw-bold text-truncate">${p.nombre}</h6>
          
          <div class="my-2">
            ${tieneDescuento ? `<span class="text-decoration-line-through text-muted me-2">S/ ${p.precio.toFixed(2)}</span>` : ''}
            <span class="fs-5 fw-bold text-danger">S/ ${precioFinal?.toFixed(2)}</span>
          </div>

          <button data-id="${p.id}" class="btn btn-outline-danger btn-agregar mt-auto">
            <i class="bi bi-cart-plus"></i> Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}