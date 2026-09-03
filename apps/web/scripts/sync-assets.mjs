import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = join(process.cwd(), "../..");
const sourceRoot = join(root, "public/assets/landing/source-pending");
const targetRoot = join(process.cwd(), "public/assets/landing/source-pending");

const assets = [
  "karabulak-tour-horse-2.jpg",
  "karabulak-tour-horse-3.jpg",
  "sxodim-horse-riding-bishkek-cover.jpg",
  "instagram-chabandes-post-CZw0ktutO3s.jpg",
  "instagram-hydepark-post-CoJvZkhsdeY.jpg",
  "sxodim-horse-club-kg-gallery-1.jpg",
  "sxodim-kara-bulak-route-1.jpg",
  "contact-sheet.jpg",
  "README.md"
];

await mkdir(targetRoot, { recursive: true });

for (const asset of assets) {
  const target = join(targetRoot, asset);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(sourceRoot, asset), target);
}
