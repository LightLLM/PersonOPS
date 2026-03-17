from langchain_core.tools import tool

_FAKE_PRODUCT_DB = {
    "personaops": {
        "tagline": "Control plane for production AI personas.",
        "key_benefits": [
            "Compare persona quality, safety, and latency.",
            "Inspect traces, logs, and evaluation runs.",
            "Ship higher-confidence AI agents to production.",
        ],
    }
}


@tool
def product_lookup_tool(name: str) -> str:
    """
    Mock lookup for basic product info.
    Useful for the Sales Closer or Research Analyst personas.
    """
    key = name.strip().lower()
    if key in _FAKE_PRODUCT_DB:
        data = _FAKE_PRODUCT_DB[key]
        benefits = "\n- ".join(data["key_benefits"])
        return f"{data['tagline']}\n\nKey benefits:\n- {benefits}"
    return "No product data found. Use general reasoning instead."

