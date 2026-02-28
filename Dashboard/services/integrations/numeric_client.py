"""Numeric financial templates client (optional)."""
import httpx
from typing import Optional, Dict, Any

from config import settings


class NumericClient:
    """Numeric API client for financial templates."""
    
    def __init__(self):
        self.api_key = settings.numeric_api_key
        self.base_url = "https://api.numeric.io/v1"
    
    def is_enabled(self) -> bool:
        """Check if Numeric is configured."""
        return bool(self.api_key)
    
    async def get_template(self, template_type: str = "saas_startup") -> Optional[Dict[str, Any]]:
        """Get a financial template."""
        if not self.is_enabled():
            return self._get_local_template()
        
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    f"{self.base_url}/templates/{template_type}",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            print(f"Numeric template error: {e}")
            return self._get_local_template()
    
    def _get_local_template(self) -> Dict[str, Any]:
        """Fallback to local template."""
        return {
            "template_type": "saas_startup",
            "assumptions": {
                "cac": {"min": 100, "typical": 500, "max": 2000},
                "ltv": {"min": 500, "typical": 3000, "max": 10000},
                "monthly_churn": {"min": 0.02, "typical": 0.05, "max": 0.15},
                "pricing": {"min": 29, "typical": 99, "max": 499},
                "unit_cost": {"min": 5, "typical": 20, "max": 100},
            },
            "metrics": [
                "ltv_cac_ratio",
                "payback_months",
                "gross_margin",
                "break_even_customers",
            ],
        }


def get_numeric_client() -> NumericClient:
    """Get Numeric client instance."""
    return NumericClient()
