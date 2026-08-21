import { Producto } from "./tipos.js";
import { productosMetro } from "./datos.js";

export const obtenerProductos = async (): Promise<Producto[]> => productosMetro;