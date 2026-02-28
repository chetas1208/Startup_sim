"""Generate markdown and PDF reports."""
import markdown
from weasyprint import HTML
from io import BytesIO

from shared.models import StartupDossier


async def generate_reports(run_id: str, dossier: StartupDossier, storage):
    """Generate markdown and PDF reports."""
    md_content = generate_markdown(dossier)
    
    # Save markdown
    await storage.save_artifact(run_id, "report.md", md_content.encode("utf-8"))
    
    # Generate PDF
    try:
        pdf_content = generate_pdf(md_content)
        await storage.save_artifact(run_id, "report.pdf", pdf_content)
    except Exception as e:
        print(f"PDF generation failed: {e}")


def generate_markdown(dossier: StartupDossier) -> str:
    """Generate markdown report."""
    md = f"""# Startup Simulation Report

**Run ID:** {dossier.run_id}  
**Created:** {dossier.created_at.strftime("%Y-%m-%d %H:%M UTC")}  
**Status:** {dossier.status.value}

---

## Original Idea

{dossier.raw_idea}

---

"""
    
    if dossier.clarified_idea:
        ci = dossier.clarified_idea
        md += f"""## 1. Clarified Idea

**Problem:** {ci.problem}

**Solution:** {ci.solution}

**Target Customer:** {ci.target_customer}

**Value Proposition:** {ci.value_proposition}

**Key Assumptions:**
{chr(10).join(f"- {a}" for a in ci.assumptions)}

---

"""
    
    if dossier.market_research:
        mr = dossier.market_research
        md += f"""## 2. Market Research

### Competitors

"""
        for comp in mr.competitors:
            md += f"""#### {comp.name}
{comp.description}

**Strengths:** {", ".join(comp.strengths)}  
**Weaknesses:** {", ".join(comp.weaknesses)}  
"""
            if comp.pricing:
                md += f"**Pricing:** {comp.pricing}  \n"
            if comp.url:
                md += f"**URL:** [{comp.url}]({comp.url})  \n"
            md += "\n"
        
        md += f"""### Market Segments

"""
        for seg in mr.segments:
            md += f"""- **{seg.name}** ({seg.size_estimate}): {", ".join(seg.characteristics)}
"""
        
        md += f"""
### Key Trends

{chr(10).join(f"- {t}" for t in mr.trends)}

### Citations

"""
        for i, cit in enumerate(mr.citations[:10], 1):
            md += f"{i}. [{cit.title}]({cit.url})\n"
        
        md += "\n---\n\n"
    
    if dossier.positioning:
        pos = dossier.positioning
        md += f"""## 3. Positioning & Differentiation

**Ideal Customer Profile (ICP):** {pos.icp}

**Positioning Statement:** {pos.positioning_statement}

**Differentiators:**
{chr(10).join(f"- {d}" for d in pos.differentiators)}

**Unique Value:** {pos.unique_value}

---

"""
    
    if dossier.mvp_plan:
        mvp = dossier.mvp_plan
        md += f"""## 4. MVP Plan

### Features

| Feature | Priority | Effort | Description |
|---------|----------|--------|-------------|
"""
        for feat in mvp.features:
            md += f"| {feat.name} | {feat.priority} | {feat.effort} | {feat.description} |\n"
        
        md += f"""
### 4-Week Roadmap

"""
        for milestone in mvp.roadmap:
            md += f"""**Week {milestone.week}:** {milestone.goal}
{chr(10).join(f"- {d}" for d in milestone.deliverables)}

"""
        
        md += f"""### Success Metrics

{chr(10).join(f"- {m}" for m in mvp.success_metrics)}

---

"""
    
    if dossier.landing_page:
        lp = dossier.landing_page
        md += f"""## 5. Landing Page Copy

**Headline:** {lp.headline}

**Subheadline:** {lp.subheadline}

**Value Propositions:**
{chr(10).join(f"- {v}" for v in lp.value_props)}

**Call-to-Action:** {lp.cta}

### Pricing

"""
        for tier in lp.pricing_tiers:
            md += f"""- **{tier.get('name', 'Tier')}**: ${tier.get('price', 0)}/mo - {tier.get('description', '')}
"""
        
        md += f"""
**Social Proof:** {lp.social_proof}

---

"""
    
    if dossier.debate:
        debate = dossier.debate
        md += f"""## 6. Investor Debate

### Bull Case

{chr(10).join(f"- {p}" for p in debate.bull_points)}

### Bear Case

{chr(10).join(f"- {p}" for p in debate.skeptic_points)}

### Synthesis

{debate.synthesis}

### Risk Mitigations

{chr(10).join(f"- {m}" for m in debate.mitigations)}

### Key Risks to Monitor

{chr(10).join(f"- {r}" for r in debate.key_risks)}

---

"""
    
    if dossier.finance:
        fin = dossier.finance
        md += f"""## 7. Financial Model

### Inputs

- **CAC (Customer Acquisition Cost):** ${fin.inputs.cac}
- **LTV (Lifetime Value):** ${fin.inputs.ltv}
- **Monthly Churn:** {fin.inputs.monthly_churn * 100:.1f}%
- **Pricing:** ${fin.inputs.pricing}/mo
- **Unit Cost:** ${fin.inputs.unit_cost}/mo

### Outputs

- **LTV/CAC Ratio:** {fin.outputs.ltv_cac_ratio:.2f}x
- **Payback Period:** {fin.outputs.payback_months:.1f} months
- **Gross Margin:** {fin.outputs.gross_margin * 100:.1f}%
- **Break-even Customers:** {fin.outputs.break_even_customers}

### Assumptions

{chr(10).join(f"- {a}" for a in fin.assumptions)}

### Sensitivity Notes

{fin.sensitivity_notes}

---

"""
    
    if dossier.final_report:
        final = dossier.final_report
        sc = final.scorecard
        
        md += f"""## 8. Final Recommendation

### Scorecard

| Dimension | Score |
|-----------|-------|
| Market Opportunity | {sc.market_opportunity}/10 |
| Competitive Advantage | {sc.competitive_advantage}/10 |
| Execution Feasibility | {sc.execution_feasibility}/10 |
| Financial Viability | {sc.financial_viability}/10 |
| **Overall Score** | **{sc.overall_score:.1f}/10** |

**Reasoning:** {sc.reasoning}

### Recommendation: **{final.recommendation.value}**

### Key Insights

{chr(10).join(f"- {i}" for i in final.key_insights)}

### Next Experiments

"""
        for exp in final.next_experiments:
            md += f"""#### {exp.hypothesis}
- **Test:** {exp.test}
- **Success Criteria:** {exp.success_criteria}
- **Timeline:** {exp.timeline}

"""
        
        md += f"""### Go-to-Market Summary

{final.go_to_market_summary}

"""
    
    md += f"""
---

*Generated by Startup Sim Agent*
"""
    
    return md


def generate_pdf(markdown_content: str) -> bytes:
    """Convert markdown to PDF."""
    html_content = markdown.markdown(
        markdown_content,
        extensions=["tables", "fenced_code"],
    )
    
    html_with_style = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 40px auto;
                padding: 0 20px;
                color: #333;
            }}
            h1 {{ color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }}
            h2 {{ color: #1e40af; margin-top: 30px; }}
            h3 {{ color: #1e3a8a; }}
            table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
            th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
            th {{ background-color: #f3f4f6; font-weight: 600; }}
            code {{ background-color: #f3f4f6; padding: 2px 6px; border-radius: 3px; }}
            a {{ color: #2563eb; text-decoration: none; }}
            hr {{ border: none; border-top: 1px solid #e5e7eb; margin: 30px 0; }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """
    
    pdf_file = BytesIO()
    HTML(string=html_with_style).write_pdf(pdf_file)
    return pdf_file.getvalue()
