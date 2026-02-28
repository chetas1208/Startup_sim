#!/usr/bin/env python3
"""Test analyze_competitor_videos with a crypto wallet app prompt.
Run from repo root with: PYTHONPATH=".:apps/api" python scripts/test_video_analysis.py
Or with venv: PYTHONPATH=".:apps/api" .venv/bin/python scripts/test_video_analysis.py
"""
import asyncio
import json
import sys

# Ensure we can load config and services
sys.path.insert(0, ".")
sys.path.insert(0, "apps/api")


async def main():
    from services.video_analysis import analyze_competitor_videos

    prompt = "A startup founder is creating a crypto wallet app for retail users."
    print("Prompt:", repr(prompt))
    print("max_videos=2, research_max_wait_seconds=600...")
    result = await analyze_competitor_videos(
        prompt, max_videos=2, research_max_wait_seconds=600.0
    )
    out = result.model_dump()
    for v in out.get("videos", []):
        if v.get("transcript"):
            t = v["transcript"]
            v["transcript"] = (t[:300] + "...") if len(t) > 300 else t
        if v.get("utterances"):
            v["utterances"] = v["utterances"][:4]
    print(json.dumps(out, indent=2))
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
