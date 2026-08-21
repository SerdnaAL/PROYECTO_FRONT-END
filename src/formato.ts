export const formatearSoles = (monto: number): string => {
  return `S/ ${monto.toFixed(2)}`;
};

export const calcularPorcentajeDescuento = (precioNormal: number, precioOferta: number): number => {
  if (precioNormal <= 0) return 0;
  const descuento = ((precioNormal - precioOferta) / precioNormal) * 100;
  return Math.round(descuento);
};

export const escaparTexto = (texto: string): string => {
  const caja = document.createElement("div");
  caja.textContent = texto;
  return caja.innerHTML;
};