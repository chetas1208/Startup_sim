"""LLM client — wraps NVIDIA NIM (OpenAI-compatible) API."""
import json
import logging
from typing import Any, Dict, Optional

import httpx

from config import settings

logger = logging.getLogger(__name__)

TIMEOUT = httpx.Timeout(180.0, connect=15.0)


async def llm_json(
    system_prompt: str,
    user_prompt: str,
    model: Optional[str] = None,
    temperature: float = 0.1,
) -> Dict[str, Any]:
    """Call the LLM and parse a JSON response."""
    model = model or settings.llm_model
    api_key = settings.openai_api_key
    base_url = settings.openai_base_url.rstrip("/")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "temperature": temperature,
        "max_tokens": 4096,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }

    logger.info(f"LLM call → {base_url}/chat/completions  model={model}")

    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
        )

        if resp.status_code != 200:
            body = resp.text
            logger.error(f"LLM API error {resp.status_code}: {body[:500]}")
            raise Exception(f"LLM API error {resp.status_code}: {body[:200]}")

        data = resp.json()

    content = data["choices"][0]["message"]["content"]
    logger.info(f"LLM response length: {len(content)} chars")
    return _extract_json(content)


def _extract_json(text: str) -> Dict[str, Any]:
    """Extract JSON from LLM output, handling markdown fences."""
    text = text.strip()

    # Try raw parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try extracting from ```json ... ``` block
    if "```json" in text:
        text = text.split("```json", 1)[1].split("```", 1)[0].strip()
    elif "```" in text:
        text = text.split("```", 1)[1].split("```", 1)[0].strip()

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Last resort: find first { ... } block
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        try:
            return json.loads(text[start : end + 1])
        except json.JSONDecodeError:
            pass

    logger.error(f"Failed to parse JSON from LLM output: {text[:300]}")
    return {"error": "Failed to parse LLM response", "raw": text[:500]}
