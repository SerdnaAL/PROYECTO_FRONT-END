import { Producto, ItemCarrito } from "./tipos.js";
import { obtenerProductos } from "./api.js";
import { agregarAlCarrito, cambiarCantidad, calcularTotal, calcularTotalUnidades } from "./carrito.js";
import { pintarCatalogo, pintarCarrito } from "./ui.js";
import { formatearSoles } from "./formato.js";

declare const bootstrap: any;

let productos: Producto[] = [];
let carrito: ItemCarrito[] = [];
let categoriaActiva = "todas";
let terminoBusqueda = "";

const contenedorProductos = document.querySelector(".productos") as HTMLElement;
const listaCarrito = document.getElementById("lista-carrito") as HTMLElement;
const totalCarrito = document.getElementById("total-carrito") as HTMLElement;
const resumenCarrito = document.getElementById("resumen-carrito") as HTMLElement;
const buscador = document.getElementById("buscador") as HTMLInputElement;
const categoriasNav = document.getElementById("categorias") as HTMLElement;
const selectorOrden = document.getElementById("orden") as HTMLSelectElement;
const btnAbrirCheckout = document.getElementById("btn-abrir-checkout") as HTMLButtonElement;
const formCheckout = document.getElementById("form-checkout") as HTMLFormElement;
const checkoutMontoTotal = document.getElementById("checkout-monto-total") as HTMLElement;

const productosVisibles = (): Producto[] => {
  let resultado = categoriaActiva === "todas"
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  if (terminoBusqueda.trim() !== "") {
    const busqueda = terminoBusqueda.toLowerCase().trim();
    resultado = resultado.filter(p => p.nombre.toLowerCase().includes(busqueda));
  }

  const criterio = selectorOrden.value;
  if (criterio === "precio-asc") {
    resultado = [...resultado].sort((a, b) => (a.precioOferta ?? a.precio) - (b.precioOferta ?? b.precio));
  } else if (criterio === "precio-desc") {
    resultado = [...resultado].sort((a, b) => (b.precioOferta ?? b.precio) - (a.precioOferta ?? a.precio));
  }

  return resultado;
};

const actualizarUI = () => {
  pintarCatalogo(productosVisibles(), contenedorProductos);
  pintarCarrito(
    carrito,
    listaCarrito,
    totalCarrito,
    resumenCarrito,
    btnAbrirCheckout,
    calcularTotal(carrito),
    calcularTotalUnidades(carrito)
  );
};

document.addEventListener("DOMContentLoaded", async () => {
  productos = await obtenerProductos();
  actualizarUI();
});

contenedorProductos.addEventListener("click", (e) => {
  const boton = (e.target as HTMLElement).closest("button[data-accion='agregar']");
  if (!boton) return;
  
  const id = Number(boton.getAttribute("data-id"));
  const productoEncontrado = productos.find(p => p.id === id);
  if (productoEncontrado) {
    carrito = agregarAlCarrito(carrito, productoEncontrado);
    actualizarUI();
  }
});

listaCarrito.addEventListener("click", (e) => {
  const boton = (e.target as HTMLElement).closest("button[data-accion]") as HTMLButtonElement;
  if (!boton) return;

  const accion = boton.dataset.accion;
  const id = Number(boton.dataset.id);

  if (accion === "mas") carrito = cambiarCantidad(carrito, id, 1);
  if (accion === "menos") carrito = cambiarCantidad(carrito, id, -1);
  if (accion === "quitar") carrito = cambiarCantidad(carrito, id, -100);

  actualizarUI();
});

buscador.addEventListener("input", (e) => {
  terminoBusqueda = (e.target as HTMLInputElement).value;
  actualizarUI();
});

categoriasNav.addEventListener("click", (e) => {
  const enlace = (e.target as HTMLElement).closest("a[data-categoria]") as HTMLAnchorElement;
  if (!enlace) return;

  e.preventDefault();
  document.querySelectorAll("#categorias a").forEach(a => a.classList.remove("active"));
  enlace.classList.add("active");

  categoriaActiva = enlace.dataset.categoria || "todas";
  actualizarUI();
});

selectorOrden.addEventListener("change", () => actualizarUI());

btnAbrirCheckout.addEventListener("click", () => {
  if (carrito.length === 0) return;
  const total = calcularTotal(carrito);
  checkoutMontoTotal.textContent = formatearSoles(total);
  
  const modal = new bootstrap.Modal(document.getElementById('modalCheckout'));
  modal.show();
});

formCheckout.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const nombreCliente = (document.getElementById("cli-nombre") as HTMLInputElement).value;
  
  alert(`¡Gracias por tu compra en Metro, ${nombreCliente}! 🎉\n\nTu pedido ha sido procesado con éxito y enviaremos la confirmación a tu correo.`);
  
  carrito = [];
  actualizarUI();
  formCheckout.reset();
  
  const modalEl = document.getElementById('modalCheckout');
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});