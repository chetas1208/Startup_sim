"""PDF generation for VentureForge reports using ReportLab."""
import os
import logging
from datetime import datetime
from typing import Optional

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

from shared.models import VentureDossier

logger = logging.getLogger(__name__)


async def generate_venture_reports(run_id: str, dossier: VentureDossier, storage):
    """Generate 3 distinct PDFs for the venture run."""
    try:
        # 1. Market Analysis PDF
        if dossier.market_research:
            market_pdf = _create_market_pdf(dossier)
            await storage.save_artifact(run_id, "market_analysis.pdf", market_pdf)
            dossier.market_research.pdf_path = f"/api/runs/{run_id}/pdf/market"

        # 2. Competitive Analysis PDF
        if dossier.competitive_analysis:
            comp_pdf = _create_competition_pdf(dossier)
            await storage.save_artifact(run_id, "competitive_analysis.pdf", comp_pdf)
            dossier.competitive_analysis.pdf_path = f"/api/runs/{run_id}/pdf/competition"

        # 3. Strategy & Positioning PDF
        if dossier.strategy:
            strategy_pdf = _create_strategy_pdf(dossier)
            await storage.save_artifact(run_id, "strategy_positioning.pdf", strategy_pdf)
            dossier.strategy.pdf_path = f"/api/runs/{run_id}/pdf/strategy"

        await storage.save_dossier(dossier)
        logger.info(f"PDF reports generated for run {run_id}")
    except Exception as e:
        logger.error(f"Failed to generate PDFs: {e}", exc_info=True)


def _create_market_pdf(dossier: VentureDossier) -> bytes:
    """Market Analysis report generation."""
    from io import BytesIO
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph("VentureForge: Market Analysis", styles['Title']))
    elements.append(Paragraph(f"Run ID: {dossier.run_id}", styles['Normal']))
    elements.append(Paragraph(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}", styles['Normal']))
    elements.append(Spacer(1, 0.5 * inch))

    # Idea
    elements.append(Paragraph("Startup Concept", styles['Heading2']))
    elements.append(Paragraph(dossier.idea_text, styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Market Summary
    elements.append(Paragraph("Market Summary", styles['Heading2']))
    elements.append(Paragraph(dossier.market_research.summary, styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Market Gaps
    elements.append(Paragraph("Market Gaps Identified", styles['Heading3']))
    for gap in dossier.market_research.market_gaps:
        elements.append(Paragraph(f"• {gap}", styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Target Customer
    if dossier.clarification:
        elements.append(Paragraph("Primary Target Customer", styles['Heading3']))
        elements.append(Paragraph(dossier.clarification.target_customer, styles['Normal']))
        elements.append(Spacer(1, 0.2 * inch))

    # Citations Appendix
    elements.append(PageBreak())
    elements.append(Paragraph("Citations & Sources", styles['Heading2']))
    for cit in dossier.market_research.citations:
        elements.append(Paragraph(f"<b>{cit.title}</b>", styles['Normal']))
        elements.append(Paragraph(f"<font color='blue'><a href='{cit.url}'>{cit.url}</a></font>", styles['Normal']))
        elements.append(Paragraph(cit.snippet, styles['Italic']))
        elements.append(Spacer(1, 0.15 * inch))

    doc.build(elements)
    return buffer.getvalue()


def _create_competition_pdf(dossier: VentureDossier) -> bytes:
    """Competitive Analysis report generation."""
    from io import BytesIO
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph("VentureForge: Competitive Analysis", styles['Title']))
    elements.append(Spacer(1, 0.5 * inch))

    # Overlap
    elements.append(Paragraph("Incumbent Overlap Assessment", styles['Heading2']))
    elements.append(Paragraph(dossier.competitive_analysis.overlap_assessment, styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Competitor Table
    elements.append(Paragraph("Key Competitor Mapping", styles['Heading2']))
    data = [["Competitor", "Focus", "Key Features"]]
    for item in dossier.competitive_analysis.competitor_comparison:
        data.append([
            item.get("competitor", "N/A"),
            item.get("focus", "N/A"),
            "\n".join(item.get("features", []))
        ])
    
    t = Table(data, colWidths=[1.5*inch, 1.5*inch, 3*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    elements.append(t)

    doc.build(elements)
    return buffer.getvalue()


def _create_strategy_pdf(dossier: VentureDossier) -> bytes:
    """Strategy & Positioning report generation."""
    from io import BytesIO
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph("VentureForge: Strategy & Positioning", styles['Title']))
    elements.append(Spacer(1, 0.5 * inch))

    # Positioning
    elements.append(Paragraph("Positioning Statement", styles['Heading2']))
    elements.append(Paragraph(f"<i>'{dossier.strategy.positioning_statement}'</i>", styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # ICP
    elements.append(Paragraph("Ideal Customer Profile (ICP)", styles['Heading2']))
    elements.append(Paragraph(dossier.strategy.icp, styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Differentiation
    elements.append(Paragraph("Differentiation Angle", styles['Heading2']))
    elements.append(Paragraph(dossier.strategy.differentiation_angle, styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Strategic Focus
    elements.append(Paragraph("Strategic Focus Recommendations", styles['Heading2']))
    elements.append(Paragraph(dossier.strategy.strategic_focus, styles['Normal']))

    doc.build(elements)
    return buffer.getvalue()
