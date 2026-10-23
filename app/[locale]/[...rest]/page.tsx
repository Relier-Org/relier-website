import { notFound } from "next/navigation";

// Cualquier ruta de más de un segmento que no exista (p. ej. /fleet/xyz/)
// cae acá y muestra la 404 del sitio, dentro del layout con idioma. Las de un
// segmento ya las resuelve [slug] (posts del blog) con notFound().
export default function CatchAll() {
  notFound();
}
