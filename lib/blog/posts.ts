import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  modified?: string;
  excerpt: string;
  cover?: string;
  coverAlt?: string;
  category: string;
  tags: string[];
  author: string;
  sourceUrl: string;
}

export interface Post extends PostFrontmatter {
  body: string;
}

const CONTENT_DIR = join(process.cwd(), "content", "news");

// Tiny YAML-ish parser for our frontmatter shape.
// Supported:
//   key: "value"        -> string
//   key: ["a", "b"]     -> string[]
const parseFrontmatter = (raw: string): PostFrontmatter => {
  const out: Record<string, unknown> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = /^([a-zA-Z][a-zA-Z0-9_]*)\s*:\s*(.+)$/.exec(trimmed);
    if (!m) continue;
    const [, key, rest] = m;
    if (rest.startsWith("[") && rest.endsWith("]")) {
      const inner = rest.slice(1, -1).trim();
      out[key] = inner
        ? inner
            .split(",")
            .map((s) => s.trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"'))
            .filter(Boolean)
        : [];
    } else if (rest.startsWith('"') && rest.endsWith('"')) {
      out[key] = rest.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    } else {
      out[key] = rest;
    }
  }
  return out as unknown as PostFrontmatter;
};

const splitFile = (raw: string): { fm: PostFrontmatter; body: string } => {
  if (!raw.startsWith("---")) {
    throw new Error("Missing frontmatter");
  }
  const end = raw.indexOf("\n---", 3);
  if (end < 0) throw new Error("Unterminated frontmatter");
  const fmRaw = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\s*\n/, "");
  return { fm: parseFrontmatter(fmRaw), body };
};

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (f) => {
      const raw = await readFile(join(CONTENT_DIR, f), "utf8");
      const { fm, body } = splitFile(raw);
      return { ...fm, body } satisfies Post;
    })
  );
  // Sort newest first (by date, then modified as tiebreaker).
  return posts.sort((a, b) => {
    if (a.date === b.date) return (b.modified ?? "").localeCompare(a.modified ?? "");
    return b.date.localeCompare(a.date);
  });
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
});
