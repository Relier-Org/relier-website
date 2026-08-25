import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import BlogHero from "@/components/sections/BlogHero";
import BlogFeatured from "@/components/sections/BlogFeatured";
import BlogGrid from "@/components/sections/BlogGrid";
import GsapProvider from "@/components/effects/GsapProvider";
import PageSchema from "@/components/seo/PageSchema";
import { blogHubNodes } from "@/lib/seo/pages";
import { getAllPosts } from "@/lib/blog/posts";

const PER_PAGE = 6;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}

// SEO: blog is excluded from the hreflang cluster — the /es and /pt
// versions canonicalize to the EN listing, no alternates emitted.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: { canonical: "https://relier.com/blog/" },
  };
}

export default async function BlogPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const query = await searchParams;
  const allPosts = await getAllPosts();
  if (allPosts.length === 0) notFound();

  const [featured, ...rest] = allPosts;

  const pageParam = Number(query.page ?? 1);
  const page = Number.isFinite(pageParam) && pageParam >= 1 ? Math.floor(pageParam) : 1;
  const pageCount = Math.max(1, Math.ceil(rest.length / PER_PAGE));

  if (page > pageCount) notFound();

  return (
    <GsapProvider>
      <PageSchema nodes={await blogHubNodes()} />
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
