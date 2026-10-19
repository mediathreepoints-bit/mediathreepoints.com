import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import React from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { services, sectors, articles, projects } from "../src/content.js";
import { siteConfig } from "../src/siteConfig.js";
import { staticTours } from "../src/tourData.js";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const routes = [
  "/",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/visites",
  ...staticTours.map((tour) => `/visites/${tour.slug}`),
  "/admin",
  "/visites-virtuelles-360",
  "/realisations",
  ...projects.map((project) => `/realisations/${project.slug}`),
  ...sectors.map((s) => s[3]),
  "/offres",
  "/agence",
  "/conseils",
  ...articles.map((a) => `/conseils/${a.slug}`),
  "/contact",
  "/confidentialite",
  "/mentions-legales",
];
const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { App } = await vite.ssrLoadModule("/src/main.jsx");
  const template = await readFile("dist/index.html", "utf8");
  const labels = {
    "/": "Accueil — Three Points Media",
    "/services": "Services digitaux — Three Points Media",
    "/visites": "Visites virtuelles 360° — Three Points Media",
    "/admin": "Administration des visites — Three Points Media",
    "/services/visites-virtuelles-360":
      "Visites virtuelles 360° — Three Points Media",
    "/visites-virtuelles-360": "Visites virtuelles 360° — Three Points Media",
    "/services/creation-sites-web":
      "Création de sites web — Three Points Media",
    "/services/media-buying":
      "Publicité digitale & media buying — Three Points Media",
    "/services/generation-de-prospects":
      "Génération de prospects — Three Points Media",
    "/services/ecommerce-cro": "E-commerce & optimisation — Three Points Media",
    "/services/seo-redaction": "SEO & rédaction — Three Points Media",
    "/realisations": "Réalisations — Three Points Media",
    "/offres": "Offres — Three Points Media",
    "/agence": "À propos — Three Points Media",
    "/conseils": "Conseils digitaux — Three Points Media",
    "/contact": "Demande de devis — Three Points Media",
    "/confidentialite": "Confidentialité — Three Points Media",
    "/mentions-legales": "Mentions légales — Three Points Media",
    "/visites-virtuelles-360": "Visites virtuelles 360° — Three Points Media",
  };
  for (const s of sectors)
    labels[s[3]] = `${s[0]} — solutions digitales — Three Points Media`;
  for (const s of services)
    labels[`/services/${s.slug}`] = `${s.title[0]} — Three Points Media`;
  for (const project of projects) {
    const projectTitle = Array.isArray(project.title)
      ? project.title[0]
      : project.title;
    labels[`/realisations/${project.slug}`] =
      `${projectTitle} — ${project.demo ? "projet de démonstration" : "portfolio graphique"} — Three Points Media`;
  }
  for (const tour of staticTours)
    labels[`/visites/${tour.slug}`] =
      `${tour.title[0]} — visite virtuelle 360° — Three Points Media`;
  for (const a of articles)
    labels[`/conseils/${a.slug}`] =
      `${a.title} — conseils digitaux — Three Points Media`;
  for (const route of routes)
    for (const lang of ["fr", "ar"]) {
      const publicRoute =
        lang === "ar" ? `/ar${route === "/" ? "/" : route}` : route;
      const htmlPath =
        publicRoute === "/"
          ? "dist/index.html"
          : path.join("dist", publicRoute.slice(1), "index.html");
      const directory = path.dirname(htmlPath);
      await mkdir(directory, { recursive: true });
      const markup = renderToString(
        React.createElement(App, { initialPath: route, initialLang: lang }),
      );
      const baseName = (
        labels[route] ||
        `${route.split("/").pop().replaceAll("-", " ")} — ${siteConfig.agencyName}`
      ).replaceAll("Three Points Media", siteConfig.agencyName);
      const arabicTitles = {
        "/": `${siteConfig.agencyName} — حضور رقمي ينمّي نشاطك`,
        "/services": "الخدمات الرقمية",
        "/visites": "جولات افتراضية 360°",
        "/admin": "إدارة الجولات الافتراضية",
        "/services/visites-virtuelles-360": "جولات افتراضية بزاوية 360°",
        "/services/creation-sites-web": "إنشاء المواقع الإلكترونية",
        "/services/media-buying": "الإعلانات الرقمية وشراء الوسائط",
        "/services/generation-de-prospects": "توليد العملاء المحتملين",
        "/services/ecommerce-cro": "التجارة الإلكترونية وتحسين التحويل",
        "/services/seo-redaction": "تحسين محركات البحث وكتابة المحتوى",
        "/realisations": "الأعمال",
        "/offres": "العروض",
        "/agence": "عن الوكالة",
        "/conseils": "نصائح وأفكار",
        "/contact": "طلب عرض سعر",
        "/confidentialite": "الخصوصية",
        "/mentions-legales": "معلومات قانونية",
        "/solutions/hotels-riads": "حلول الفنادق والرياض",
        "/solutions/restaurants": "حلول المطاعم والفضاءات",
        "/solutions/immobilier": "حلول العقارات",
        "/solutions/formation": "حلول التعليم والتدريب",
        "/solutions/showrooms": "حلول صالات العرض والخدمات",
        "/conseils/visite-virtuelle-hebergement":
          "الجولة الافتراضية في تجربة الضيافة",
        "/conseils/site-web-qui-convertit":
          "الموقع المفيد يبدأ بالأسئلة المناسبة",
        "/conseils/prospects-qualifies": "ماذا يعني العميل المحتمل المؤهل؟",
      };
      for (const s of services)
        arabicTitles[`/services/${s.slug}`] = s.title[1];
      for (const project of projects)
        if (Array.isArray(project.title))
          arabicTitles[`/realisations/${project.slug}`] = project.title[1];
      for (const tour of staticTours)
        arabicTitles[`/visites/${tour.slug}`] = tour.title[1];
      const title =
        lang === "ar"
          ? `${arabicTitles[route] || baseName.split(" — ")[0]} | ${siteConfig.agencyName}`
          : baseName;
      const description =
        lang === "ar"
          ? `اكتشف ${arabicTitles[route] || `خدمات ${siteConfig.agencyName}`} والحلول الرقمية للشركات في المغرب.`
          : route === "/"
            ? "Visites virtuelles 360°, sites web et acquisition digitale pour les entreprises au Maroc."
            : `${baseName.split(" — ")[0]} : une expertise digitale au service des entreprises au Maroc.`;
      const alternates = `<link rel="alternate" hreflang="fr-MA" href="${route}"><link rel="alternate" hreflang="ar-MA" href="/ar${route === "/" ? "/" : route}"><link rel="alternate" hreflang="x-default" href="${route}">`;
      let html = template
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(
          /<meta name="description" content="[^"]*"\/>/,
          `<meta name="description" content="${escapeHtml(description)}"/>`,
        )
        .replace(
          /<meta property="og:title" content="[^"]*"\/>/,
          `<meta property="og:title" content="${escapeHtml(title)}"/>`,
        )
        .replace(
          /<meta property="og:description" content="[^"]*"\/>/,
          `<meta property="og:description" content="${escapeHtml(description)}"/>`,
        )
        .replace("</head>", `${alternates}</head>`)
        .replace(
          '<html lang="fr">',
          `<html lang="${lang}" dir="${lang === "ar" ? "rtl" : "ltr"}">`,
        )
        .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
      if (route === "/admin")
        html = html.replace(
          "</head>",
          '<meta name="robots" content="noindex,nofollow"></head>',
        );
      await writeFile(htmlPath, html);
    }
  const base = process.env.SITE_URL?.replace(/\/$/, "");
  if (base) {
    const urls = routes
      .filter((route) => route !== "/admin")
      .flatMap((route) =>
        ["fr", "ar"].map(
          (lang) =>
            `<url><loc>${base}${lang === "ar" ? `/ar${route === "/" ? "/" : route}` : route}</loc><changefreq>monthly</changefreq></url>`,
        ),
      )
      .join("");
    await writeFile(
      "dist/sitemap.xml",
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    );
  }
} finally {
  await vite.close();
}
