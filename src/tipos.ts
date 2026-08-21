export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  precioOferta?: number;
  categoria: string;
  imagen: string;
  stock: number;
  cuotasSinInteres?: number; 
}

export interface ItemCarrito {
  id: number;
  producto: Producto;
  cantidad: number;
}