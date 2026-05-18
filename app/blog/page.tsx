import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import BlogFeatured from "@/components/sections/BlogFeatured";
import BlogGrid from "@/components/sections/BlogGrid";
import GsapProvider from "@/components/effects/GsapProvider";
import { getAllPosts } from "@/lib/blog/posts";

export const metadata: Metadata = {
  title: "News · Relier — Insights & Travel Notes",
  description:
    "Stories, itineraries, and field notes from Relier's chauffeurs and concierge desks across New York, Europe, and beyond.",
  alternates: { canonical: "https://relier.com/blog/" },
};

const PER_PAGE = 6;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const allPosts = await getAllPosts();
  if (allPosts.length === 0) notFound();

  const [featured, ...rest] = allPosts;

  const pageParam = Number(params.page ?? 1);
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? Math.floor(pageParam) : 1;
  const pageCount = Math.max(1, Math.ceil(rest.length / PER_PAGE));

  if (page > pageCount) notFound();

  return (
    <GsapProvider>
      <Nav />
      <main>
        <BlogHero />
        <BlogFeatured post={featured} />
        <BlogGrid
          posts={rest}
          page={page}
          pageCount={pageCount}
          perPage={PER_PAGE}
          showLead
        />
      </main>
      <Footer />
    </GsapProvider>
  );
}
