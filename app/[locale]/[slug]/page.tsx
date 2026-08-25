import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import PostBody from "@/components/sections/PostBody";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { postNodes } from "@/lib/seo/pages";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// SEO: posts are EN-only and excluded from the hreflang cluster — every
// locale version canonicalizes to the unprefixed EN URL, no alternates.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonical = `https://relier.com/${post.slug}/`;
  const description = post.metaDescription ?? post.excerpt;
  return {
    title: post.seoTitle ?? `${post.title} · Relier`,
    description,
    alternates: { canonical },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description,
      url: canonical,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.cover ? [{ url: post.cover, alt: post.coverAlt }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <GsapProvider>
      <PageSchema nodes={await postNodes(post)} />
      <Nav />
      <main>
        {/* as="p": el H1 de esta página es el título del artículo (PostBody). */}
        <BlogHero as="p" />
        <PostBody post={post} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
