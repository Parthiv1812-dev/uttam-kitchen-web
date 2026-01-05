const fs = require("fs");
const path = require("path");

const siteUrl = process.env.SITE_URL || "https://uttamkitchen.com";
const baseRoutes = ["/", "/about", "/catalog", "/manufacturing"];

const productsPath = path.join(__dirname, "..", "src", "data", "products.ts");
const publicDir = path.join(__dirname, "..", "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");

function getProductIds() {
  const content = fs.readFileSync(productsPath, "utf8");
  const matches = [...content.matchAll(/id:\s*(\d+)/g)].map((m) => Number(m[1]));
  const ids = [...new Set(matches)].filter((n) => Number.isFinite(n));
  return ids.sort((a, b) => a - b);
}

function buildUrl(route) {
  return new URL(route, siteUrl).toString();
}

function buildXml(urls) {
  const urlEntries = urls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function main() {
  const productIds = getProductIds();
  const productRoutes = productIds.map((id) => `/product/${id}`);
  const allRoutes = [...baseRoutes, ...productRoutes];
  const urls = allRoutes.map(buildUrl);

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(sitemapPath, buildXml(urls), "utf8");

  console.log(
    `Sitemap written to ${sitemapPath} with ${urls.length} URLs (products: ${productIds.length})`
  );
}

main();
