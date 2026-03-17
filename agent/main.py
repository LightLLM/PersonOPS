import logging
import time
from typing import Dict, Any

from gradient_adk import entrypoint
from langchain_core.messages import HumanMessage

from agents import build_workflow, PersonaId

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s",
)
logger = logging.getLogger("personaops-agent")

workflow = build_workflow()


@entrypoint
async def main(payload: Dict[str, Any], context: Dict[str, Any]):
    """
    PersonaOps entrypoint for DigitalOcean Gradient AI ADK.
    """
    start_time = time.time()
    prompt = str(payload.get("prompt", "")).strip()
    persona = payload.get("persona", "research")

    if persona not in ("compliance", "sales", "research"):
        persona = "research"

    persona_typed: PersonaId = persona  # for type checkers

    logger.info(
        "Received request: persona=%s trace_id=%s",
        persona_typed,
        context.get("trace_id"),
    )

    if not prompt:
        logger.warning("Empty prompt received.")
        return {
            "persona": persona_typed,
            "response": "Please provide a non-empty prompt.",
            "meta": {
                "latency_ms": 0,
                "error": "empty_prompt",
            },
        }

    try:
        initial_state = {
            "messages": [HumanMessage(content=prompt)],
            "persona": persona_typed,
            "meta": {},
        }

        result = await workflow.ainvoke(initial_state)

        messages = result["messages"]
        last_message = messages[-1] if messages else None
        latency_ms = int((time.time() - start_time) * 1000)

        logger.info(
            "Successfully processed request: persona=%s latency_ms=%d",
            persona_typed,
            latency_ms,
        )

        return {
            "persona": persona_typed,
            "response": getattr(last_message, "content", ""),
            "meta": {
                "latency_ms": latency_ms,
                "model": "env:MODEL_ID",
                "trace_hint": "View detailed LangGraph traces in Gradient workspace.",
            },
        }
    except Exception as e:  # noqa: BLE001
        logger.error("Error processing request: %s", e, exc_info=True)
        latency_ms = int((time.time() - start_time) * 1000)
        return {
            "persona": persona_typed,
            "response": "Sorry, something went wrong while processing your request.",
            "meta": {
                "latency_ms": latency_ms,
                "error": str(e),
            },
        }

