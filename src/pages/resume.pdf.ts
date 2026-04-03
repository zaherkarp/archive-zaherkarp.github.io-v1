import type { APIRoute } from "astro";
import PDFDocument from "pdfkit";
import { siteConfig } from "../config";

// Tight single-page layout
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const MARGIN_TOP = 36;
const MARGIN_BOTTOM = 30;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const ACCENT = "#2563eb";
const TEXT_COLOR = "#1f2937";
const LIGHT_COLOR = "#6b7280";

type Doc = InstanceType<typeof PDFDocument>;

function addHeader(doc: Doc) {
  // Name and title on one conceptual block
  doc.fontSize(18).font("Helvetica-Bold").fillColor(TEXT_COLOR);
  doc.text(siteConfig.fullName, MARGIN_LEFT, MARGIN_TOP);

  doc.fontSize(9.5).font("Helvetica").fillColor(ACCENT);
  doc.text(siteConfig.title, MARGIN_LEFT, doc.y + 1);

  // Contact line
  const contactParts: string[] = [];
  if (siteConfig.social?.email) contactParts.push(siteConfig.social.email);
  if (siteConfig.social?.linkedin)
    contactParts.push(siteConfig.social.linkedin.replace("https://", ""));
  if (siteConfig.social?.github)
    contactParts.push(siteConfig.social.github.replace("https://", ""));

  doc.fontSize(8).font("Helvetica").fillColor(LIGHT_COLOR);
  doc.text(contactParts.join("  |  "), MARGIN_LEFT, doc.y + 2);

  // Divider
  const y = doc.y + 5;
  doc.moveTo(MARGIN_LEFT, y).lineTo(PAGE_WIDTH - MARGIN_RIGHT, y).lineWidth(1.2).strokeColor(ACCENT).stroke();
  doc.y = y + 6;
}

function addSectionTitle(doc: Doc, title: string) {
  doc.fontSize(9.5).font("Helvetica-Bold").fillColor(ACCENT);
  doc.text(title.toUpperCase(), MARGIN_LEFT, doc.y + 4);
  const y = doc.y + 1;
  doc.moveTo(MARGIN_LEFT, y).lineTo(PAGE_WIDTH - MARGIN_RIGHT, y).lineWidth(0.4).strokeColor("#d1d5db").stroke();
  doc.y = y + 3;
}

function addExperience(doc: Doc) {
  addSectionTitle(doc, "Experience");

  for (const job of siteConfig.experience) {
    const startY = doc.y;

    // Title and date on same line
    doc.fontSize(9).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(job.title, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH * 0.72, continued: false });

    doc.fontSize(8).font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(job.dateRange, MARGIN_LEFT + CONTENT_WIDTH * 0.72, startY, {
      width: CONTENT_WIDTH * 0.28,
      align: "right",
    });

    doc.fontSize(8.5).font("Helvetica").fillColor(TEXT_COLOR);
    doc.text(job.company, MARGIN_LEFT, doc.y - 1);

    // Bullets
    if (job.bullets && job.bullets.length > 0) {
      doc.y += 1;
      for (const bullet of job.bullets) {
        doc.fontSize(8).font("Helvetica").fillColor(TEXT_COLOR);
        const bulletX = MARGIN_LEFT + 7;
        doc.text("\u2022", MARGIN_LEFT, doc.y, { width: 7 });
        doc.text(bullet, bulletX, doc.y - doc.currentLineHeight(), {
          width: CONTENT_WIDTH - 7,
        });
      }
    }
    doc.y += 3;
  }
}

function addSkills(doc: Doc) {
  addSectionTitle(doc, "Skills");

  for (const category of siteConfig.skillCategories) {
    doc.fontSize(8).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(category.label + ": ", MARGIN_LEFT, doc.y, {
      continued: true,
      width: CONTENT_WIDTH,
    });
    doc.font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(category.skills.join(", "), { width: CONTENT_WIDTH });
    doc.y += 1;
  }
}

function addEducation(doc: Doc) {
  addSectionTitle(doc, "Education");

  for (const edu of siteConfig.education) {
    const startY = doc.y;

    doc.fontSize(9).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(edu.degree, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH * 0.72 });

    doc.fontSize(8).font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(edu.dateRange, MARGIN_LEFT + CONTENT_WIDTH * 0.72, startY, {
      width: CONTENT_WIDTH * 0.28,
      align: "right",
    });

    doc.fontSize(8.5).font("Helvetica").fillColor(TEXT_COLOR);
    doc.text(edu.school, MARGIN_LEFT, doc.y - 1);
    doc.y += 3;
  }
}

export const GET: APIRoute = async () => {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: {
      top: MARGIN_TOP,
      bottom: MARGIN_BOTTOM,
      left: MARGIN_LEFT,
      right: MARGIN_RIGHT,
    },
    info: {
      Title: `${siteConfig.fullName} - Resume`,
      Author: siteConfig.fullName,
      Subject: siteConfig.title,
    },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  addHeader(doc);
  addExperience(doc);
  addSkills(doc);
  addEducation(doc);

  doc.end();

  await new Promise<void>((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(chunks);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${siteConfig.fullName.replace(/ /g, "_")}_Resume.pdf"`,
    },
  });
};
