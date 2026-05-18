import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import PostBody from "@/components/sections/PostBody";
import GsapProvider from "@/components/effects/GsapProvider";
import { getAllPosts, getPostBySlug } from "@/lib/blog/posts";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const canonical = `https://relier.com/${post.slug}/`;
  return {
    title: `${post.title} · Relier`,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: post.cover ? [{ url: post.cover, alt: post.coverAlt }] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <GsapProvider>
      <Nav />
      <main>
        <BlogHero />
        <PostBody post={post} />
      </main>
      <Footer />
    </GsapProvider>
  );
}
