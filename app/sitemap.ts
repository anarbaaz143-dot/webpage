import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://propoye.com";

  // Fetch dynamic data
  const properties = await prisma.property.findMany({
    select: {
      slug: true,
      createdAt: true,
    },
  });

  const blogs = await prisma.blog.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  const news = await prisma.news.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  });

  // Static pages
  const staticPages = [
    "",
    "/about",
    "/blog",
    "/contact",
    "/loan-calculator",
    "/news",
    "/search",
    "/trending",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Property Pages
  const propertyPages = properties.map((property) => ({
    url: `${baseUrl}/property/${property.slug}`,
    lastModified: property.createdAt,
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Dynamic Blog Pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.id}`,
    lastModified: blog.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic News Pages
  const newsPages = news.map((item) => ({
    url: `${baseUrl}/news/${item.id}`,
    lastModified: item.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...blogPages,
    ...newsPages,
  ];
}