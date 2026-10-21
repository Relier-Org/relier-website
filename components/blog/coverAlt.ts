import type { Post } from "@/lib/blog/posts";

const normalize = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/**
 * Alt de la portada en las cards, donde la imagen va pegada al título del
 * post. Muchos .mdx traen un coverAlt que repite el título (a veces con otra
 * puntuación): ahí la imagen es decorativa y el alt va vacío para no leer el
 * título dos veces. Sin coverAlt, también vacío.
 */
export function cardCoverAlt(post: Pick<Post, "title" | "coverAlt">): string {
  if (!post.coverAlt) return "";
  return normalize(post.coverAlt) === normalize(post.title) ? "" : post.coverAlt;
}
