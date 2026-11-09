// Downloads the public-domain posters and backdrops from Wikimedia Commons and saves them as WebP
// in public/posters (600×900) and public/backdrops (1600×900). Run once: npm run images.
// The file names on Commons are the source of truth, so credits can always be traced back.
import { access, mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const images = {
  nosferatu: ["Max Schreck as Count Orlok in Nosferatu – Eine Symphonie des Grauens (1922).jpg", "Nosferatu (1922) - Count Orlok Standing In A Wooden Doorway (Greyscale).png"],
  caligari: ["Das Cabinet des Dr. Caligari.JPG", "CABINET DES DR CALIGARI 01.jpg"],
  "la-noche-de-los-muertos-vivientes": ["Night Of The Living Dead (1968) - Poster.jpg", "Night Of The Living Dead trailer screenshot.jpg"],
  "el-carnaval-de-las-almas": ["Carnival of Souls (1962 one-sheet poster).jpg", "COS 06.JPG"],
  "el-fantasma-de-la-opera": ["Phantom of the opera 1925 poster.jpg", "The Phantom of the Opera (1925) - 16.jpg"],
  "la-tiendita-de-los-horrores": ["The Little Shop of Horrors (1960) - Half-Sheet poster.webp", "Little Shop of Horrors title sequence.JPG"],
  "el-maquinista-de-la-general": ["The General (1926) - Movie Poster 2.png", "Buster Keaton on the cow-catcher in The General.jpg"],
  "luna-nueva": ["His Girl Friday (1940 poster) crop.jpg", "His-Girl-Friday-Grant-Russell.jpg"],
  detour: ["Detour (poster).jpg", "Ann Savage and Tom Neal in Detour.jpg"],
  "el-autoestopista": ["The Hitch-Hiker (1953 poster).jpeg", "Natividad Vacío in The Hitch-Hiker.jpg"],
  "viaje-a-la-luna": ["Voyage dans la Lune affiche.jpg", "Melies color Voyage dans la lune.jpg"],
  "el-acorazado-potemkin": ["Vintage Potemkin.jpg", "Battleship Potemkin-Ship portrait.jpg"],
  amanecer: ["Sunrise (Fox, 1927) Window Card.jpg", "Aurora 1927.png"],
  superman: ["This looks like a job for Superman.jpg", "Supermanshorttitle.PNG"],
  "chaplin-mutual": ["CC The Immigrant 1917.JPG", 'Charlie Chaplin in a scene from "The Immigrant" (SAYRE 13126).jpg'],
  "keaton-cortos": ["Buster keaton one week poster.jpg", "Keaton One Week 1920.jpg"],
};

const ua = { "User-Agent": "notflix-portfolio/2.0 (image fetch for a student portfolio)" };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function download(file, width) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}${width ? `?width=${width}` : ""}`;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { headers: ua });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    // 429 means "slow down": wait and retry. Any other error on a resized copy usually means
    // Commons refuses to upscale a smaller original, so ask for the original instead.
    if (res.status !== 429 && width) return download(file, 0);
    await wait(15000 * attempt);
  }
  throw new Error(`No se pudo descargar ${file}`);
}

await mkdir("public/posters", { recursive: true });
await mkdir("public/backdrops", { recursive: true });

for (const [slug, [poster, backdrop]] of Object.entries(images)) {
  if (await access(`public/backdrops/${slug}.webp`).then(() => true, () => false)) continue;
  const p = await download(poster, 900);
  await writeFile(`public/posters/${slug}.webp`,
    await sharp(p).resize(600, 900, { fit: "cover", position: "attention" }).webp({ quality: 78 }).toBuffer());
  await wait(1500);
  const b = await download(backdrop, 1600);
  await writeFile(`public/backdrops/${slug}.webp`,
    await sharp(b).resize(1600, 900, { fit: "cover", position: "attention" }).webp({ quality: 72 }).toBuffer());
  console.log(`✓ ${slug}`);
  await wait(1500);
}
