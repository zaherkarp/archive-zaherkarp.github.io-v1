import type { APIRoute } from "astro";
import PDFDocument from "pdfkit";
import { siteConfig } from "../config";

// Page layout constants
const PAGE_WIDTH = 612; // US Letter
const PAGE_HEIGHT = 792;
const MARGIN_LEFT = 54;
const MARGIN_RIGHT = 54;
const MARGIN_TOP = 48;
const MARGIN_BOTTOM = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const ACCENT = "#2563eb";
const TEXT_COLOR = "#1f2937";
const LIGHT_COLOR = "#6b7280";

function addHeader(doc: InstanceType<typeof PDFDocument>) {
  doc.fontSize(22).font("Helvetica-Bold").fillColor(TEXT_COLOR);
  doc.text(siteConfig.fullName, MARGIN_LEFT, MARGIN_TOP);

  doc.fontSize(11).font("Helvetica").fillColor(ACCENT);
  doc.text(siteConfig.title, MARGIN_LEFT, doc.y + 2);

  // Contact line
  const contactParts: string[] = [];
  if (siteConfig.social?.email) contactParts.push(siteConfig.social.email);
  if (siteConfig.social?.linkedin)
    contactParts.push(siteConfig.social.linkedin.replace("https://", ""));
  if (siteConfig.social?.github)
    contactParts.push(siteConfig.social.github.replace("https://", ""));

  doc.fontSize(9).font("Helvetica").fillColor(LIGHT_COLOR);
  doc.text(contactParts.join("  |  "), MARGIN_LEFT, doc.y + 4);

  // Divider
  const y = doc.y + 8;
  doc.moveTo(MARGIN_LEFT, y).lineTo(PAGE_WIDTH - MARGIN_RIGHT, y).lineWidth(1.5).strokeColor(ACCENT).stroke();
  doc.y = y + 10;
}

function addSectionTitle(doc: InstanceType<typeof PDFDocument>, title: string) {
  ensureSpace(doc, 30);
  doc.fontSize(12).font("Helvetica-Bold").fillColor(ACCENT);
  doc.text(title.toUpperCase(), MARGIN_LEFT, doc.y + 6);
  const y = doc.y + 2;
  doc.moveTo(MARGIN_LEFT, y).lineTo(PAGE_WIDTH - MARGIN_RIGHT, y).lineWidth(0.5).strokeColor("#d1d5db").stroke();
  doc.y = y + 6;
}

function ensureSpace(doc: InstanceType<typeof PDFDocument>, needed: number) {
  if (doc.y + needed > PAGE_HEIGHT - MARGIN_BOTTOM) {
    doc.addPage();
    doc.y = MARGIN_TOP;
  }
}

function addExperience(doc: InstanceType<typeof PDFDocument>) {
  addSectionTitle(doc, "Experience");

  for (const job of siteConfig.experience) {
    ensureSpace(doc, 50);
    const startY = doc.y;

    // Title and company
    doc.fontSize(10.5).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(job.title, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH * 0.7, continued: false });

    doc.fontSize(9).font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(job.dateRange, MARGIN_LEFT + CONTENT_WIDTH * 0.7, startY, {
      width: CONTENT_WIDTH * 0.3,
      align: "right",
    });

    doc.fontSize(10).font("Helvetica").fillColor(TEXT_COLOR);
    doc.text(job.company, MARGIN_LEFT, doc.y);

    // Bullets
    if (job.bullets && job.bullets.length > 0) {
      doc.y += 2;
      for (const bullet of job.bullets) {
        ensureSpace(doc, 24);
        doc.fontSize(9).font("Helvetica").fillColor(TEXT_COLOR);
        const bulletX = MARGIN_LEFT + 8;
        doc.text("\u2022", MARGIN_LEFT, doc.y, { width: 8 });
        doc.text(bullet, bulletX, doc.y - doc.currentLineHeight(), {
          width: CONTENT_WIDTH - 8,
        });
      }
    }
    doc.y += 6;
  }
}

function addSkills(doc: InstanceType<typeof PDFDocument>) {
  addSectionTitle(doc, "Skills");

  for (const category of siteConfig.skillCategories) {
    ensureSpace(doc, 20);
    doc.fontSize(9.5).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(category.label + ": ", MARGIN_LEFT, doc.y, {
      continued: true,
      width: CONTENT_WIDTH,
    });
    doc.font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(category.skills.join(", "), { width: CONTENT_WIDTH });
    doc.y += 2;
  }
}

function addEducation(doc: InstanceType<typeof PDFDocument>) {
  addSectionTitle(doc, "Education");

  for (const edu of siteConfig.education) {
    ensureSpace(doc, 36);
    const startY = doc.y;

    doc.fontSize(10.5).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(edu.degree, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH * 0.7 });

    doc.fontSize(9).font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(edu.dateRange, MARGIN_LEFT + CONTENT_WIDTH * 0.7, startY, {
      width: CONTENT_WIDTH * 0.3,
      align: "right",
    });

    doc.fontSize(10).font("Helvetica").fillColor(TEXT_COLOR);
    doc.text(edu.school, MARGIN_LEFT, doc.y);

    if (edu.achievements && edu.achievements.length > 0) {
      doc.y += 2;
      for (const achievement of edu.achievements) {
        ensureSpace(doc, 20);
        doc.fontSize(9).font("Helvetica").fillColor(TEXT_COLOR);
        doc.text("\u2022", MARGIN_LEFT, doc.y, { width: 8 });
        doc.text(achievement, MARGIN_LEFT + 8, doc.y - doc.currentLineHeight(), {
          width: CONTENT_WIDTH - 8,
        });
      }
    }
    doc.y += 6;
  }
}

function addPublications(doc: InstanceType<typeof PDFDocument>) {
  addSectionTitle(doc, "Publications");

  for (const pub of siteConfig.publications) {
    ensureSpace(doc, 30);
    doc.fontSize(9.5).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(pub.title, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH });

    doc.fontSize(8.5).font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(`${pub.authors}. ${pub.journal}, ${pub.year}.`, MARGIN_LEFT, doc.y, {
      width: CONTENT_WIDTH,
    });
    doc.y += 5;
  }
}

function addProjects(doc: InstanceType<typeof PDFDocument>) {
  addSectionTitle(doc, "Selected Projects");

  for (const project of siteConfig.projects) {
    ensureSpace(doc, 30);
    doc.fontSize(9.5).font("Helvetica-Bold").fillColor(TEXT_COLOR);
    doc.text(project.name, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH });

    doc.fontSize(8.5).font("Helvetica").fillColor(LIGHT_COLOR);
    doc.text(project.description, MARGIN_LEFT, doc.y, { width: CONTENT_WIDTH });

    if (project.skills && project.skills.length > 0) {
      doc.fontSize(8).font("Helvetica").fillColor(ACCENT);
      doc.text(project.skills.join(" \u00B7 "), MARGIN_LEFT, doc.y + 1, {
        width: CONTENT_WIDTH,
      });
    }
    doc.y += 5;
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
  addPublications(doc);
  addProjects(doc);

  doc.end();

  // Wait for the PDF to finish writing
  await new Promise<void>((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(chunks);

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${siteConfig.fullName.replace(/ /g, "_")}_Resume.pdf"`,
    },
  });
};
