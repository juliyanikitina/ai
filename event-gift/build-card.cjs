const fs = require("fs");
const path = require("path");
const { createRequire } = require("module");
const workerRequire = createRequire("C:/Users/user/Documents/Codex/2026-09-04/ai-3/work/ai-komanda-worker/package.json");
const QRCode = workerRequire("qrcode");
const sharp = workerRequire("sharp");
const jsQR = workerRequire("jsqr");
const PDFDocument = workerRequire("pdfkit");

const targetUrl = "https://juliyanikitina.github.io/ai/map/";
const root = path.resolve(__dirname, "..");
const outDir = path.join(__dirname, "output");
fs.mkdirSync(outDir, { recursive: true });

const fontRoot = "C:/Users/user/.codex/skills/canvas-design/canvas-fonts";
const bold = fs.readFileSync(path.join(fontRoot, "BricolageGrotesque-Bold.ttf")).toString("base64");
const regular = fs.readFileSync(path.join(fontRoot, "BricolageGrotesque-Regular.ttf")).toString("base64");

function escapeXml(value) {
  return String(value).replace(/[&<>\"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&apos;" }[c]));
}

(async () => {
  const qrBuffer = await QRCode.toBuffer(targetUrl, { type: "png", width: 430, margin: 4, errorCorrectionLevel: "H", color: { dark: "#171717", light: "#ffffff" } });
  const qrData = qrBuffer.toString("base64");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" xmlns="http://www.w3.org/2000/svg">
    <defs><style>
      @font-face{font-family:Bricolage;src:url(data:font/ttf;base64,${regular})}
      @font-face{font-family:Bricolage;src:url(data:font/ttf;base64,${bold});font-weight:700}
      .b{font-family:Bricolage,Arial,sans-serif;font-weight:700}.r{font-family:Bricolage,Arial,sans-serif}
    </style></defs>
    <rect width="1080" height="1350" fill="#f6f3ef"/>
    <rect x="34" y="34" width="1012" height="1282" rx="42" fill="#ffffff"/>
    <rect x="70" y="70" width="940" height="94" rx="47" fill="#ef2b2d"/>
    <g transform="translate(99 85) scale(1.65)">
      <path fill="#ffd21f" d="M4 14h28v19H4z"/><path fill="#d91521" d="M16 14h4v19h-4z"/>
      <rect x="2" y="10" width="32" height="7" rx="2" fill="#ffd21f"/><path fill="#d91521" d="M16 10h4v7h-4z"/>
      <path d="M18 10C15 4 8 2 7 6c-1 5 6 6 11 4Zm0 0c3-6 10-8 11-4 1 5-6 6-11 4Z" fill="none" stroke="#d91521" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="186" y="129" class="b" font-size="28" fill="#fff" letter-spacing="1.4">ПОДАРОК УЧАСТНИКАМ МЕРОПРИЯТИЯ</text>
    <text x="78" y="250" class="b" font-size="72" fill="#171717"><tspan x="78">КАКИЕ</tspan><tspan x="78" dy="72">ИИ-СОТРУДНИКИ</tspan><tspan x="78" dy="72">НУЖНЫ ВАШЕМУ</tspan><tspan x="78" dy="72">БИЗНЕСУ</tspan><tspan x="78" dy="72" fill="#ef2b2d">ПРЯМО СЕЙЧАС?</tspan></text>
    <text x="80" y="634" class="r" font-size="28" fill="#3f3f3f"><tspan x="80">Получите персональную карту ИИ-команды</tspan><tspan x="80" dy="40">бесплатно — за несколько минут.</tspan></text>

    <rect x="68" y="748" width="460" height="424" rx="32" fill="#171717"/>
    <text x="102" y="805" class="b" font-size="24" fill="#fff">В КАРТЕ БУДУТ</text>
    <g class="r" font-size="25" fill="#fff">
      <circle cx="107" cy="866" r="7" fill="#ef2b2d"/><text x="132" y="875">состав цифровых сотрудников</text>
      <circle cx="107" cy="932" r="7" fill="#ef2b2d"/><text x="132" y="941">задачи и результат каждого</text>
      <circle cx="107" cy="998" r="7" fill="#ef2b2d"/><text x="132" y="1007">сервисы и интеграции</text>
      <circle cx="107" cy="1064" r="7" fill="#ef2b2d"/><text x="132" y="1073">порядок внедрения на 30 дней</text>
    </g>
    <text x="298" y="1121" text-anchor="middle" class="b" font-size="16" fill="#ef2b2d"><tspan x="298">ИНФОРМАЦИЯ, КОТОРУЮ</tspan><tspan x="298" dy="22">МОЖНО ПРИМЕНИТЬ СРАЗУ</tspan></text>

    <rect x="570" y="720" width="440" height="502" rx="34" fill="#ef2b2d"/>
    <rect x="592" y="742" width="396" height="396" rx="22" fill="#fff"/>
    <image x="575" y="725" width="430" height="430" href="data:image/png;base64,${qrData}"/>
    <text x="790" y="1182" text-anchor="middle" class="b" font-size="23" fill="#fff">СКАНИРУЙТЕ QR-КОД</text>
    <text x="790" y="1212" text-anchor="middle" class="r" font-size="18" fill="#fff">6 вопросов · результат сразу</text>

    <line x1="70" y1="1253" x2="1010" y2="1253" stroke="#ded8d1" stroke-width="2"/>
    <text x="78" y="1292" class="b" font-size="24" fill="#171717">ЮЛИЯ НИКИТИНА</text>
    <text x="996" y="1292" text-anchor="end" class="r" font-size="20" fill="#666">ИИ-агенты и цифровые решения для бизнеса</text>
  </svg>`;

  const pngPath = path.join(outDir, "Подарок-участникам-карта-ИИ-команды-QR.png");
  const pdfPath = path.join(outDir, "Подарок-участникам-карта-ИИ-команды-QR.pdf");
  const sitePreviewPath = path.join(root, "map", "qr-gift-card.png");
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  fs.writeFileSync(pngPath, png);
  fs.writeFileSync(sitePreviewPath, png);

  const pdf = new PDFDocument({ autoFirstPage: false, compress: true });
  const stream = fs.createWriteStream(pdfPath);
  pdf.pipe(stream);
  pdf.addPage({ size: [540, 675], margin: 0 });
  pdf.image(png, 0, 0, { width: 540, height: 675 });
  pdf.end();
  await new Promise((resolve, reject) => { stream.on("finish", resolve); stream.on("error", reject); });

  const crop = await sharp(png).extract({ left: 575, top: 725, width: 430, height: 430 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const decoded = jsQR(new Uint8ClampedArray(crop.data), crop.info.width, crop.info.height);
  if (!decoded || decoded.data !== targetUrl) throw new Error(`QR validation failed: ${decoded?.data || "not decoded"}`);
  console.log(JSON.stringify({ pngPath, pdfPath, sitePreviewPath, decoded: decoded.data }, null, 2));
})();
