import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const builtHtml = join(dist, "dev.html");

if (!existsSync(builtHtml)) {
  console.error("Build output not found:", builtHtml);
  process.exit(1);
}

cpSync(builtHtml, "index.html");
if (existsSync("assets")) rmSync("assets", { recursive: true });
cpSync(join(dist, "assets"), "assets", { recursive: true });

const publicLogo = join(dist, "brand-logo.svg");
if (existsSync(publicLogo)) {
  cpSync(publicLogo, "brand-logo.svg");
}

console.log("Published to admin/analytics/index.html");
