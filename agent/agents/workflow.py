import os
import time
import logging
from typing import TypedDict, List, Dict, Any

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage, BaseMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition

from gradient import AsyncGradient

from .prompts import PERSONA_SYSTEM_PROMPTS, PersonaId
from agent.tools import calculator_tool, product_lookup_tool

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    messages: List[BaseMessage]
    persona: PersonaId
    meta: Dict[str, Any]


def _build_llm_with_tools() -> Any:
    """
    Build a Gradient-backed LLM with tools.
    Adjust model ID if needed for your Gradient account.
    """
    model_id = os.environ.get("MODEL_ID", "openai-gpt-oss-120b")

    client = AsyncGradient(
        inference_endpoint="https://inference.do-ai.run",
        model_access_key=os.environ.get("GRADIENT_MODEL_ACCESS_KEY"),
    )

    class GradientChatModel:
        def __init__(self, client: AsyncGradient, model: str):
            self._client = client
            self._model = model

        async def ainvoke(self, messages: List[BaseMessage], config: RunnableConfig | None = None):
            start = time.time()
            mapped = []
            for m in messages:
                role = "user"
                if isinstance(m, SystemMessage):
                    role = "system"
                elif isinstance(m, AIMessage):
                    role = "assistant"
                mapped.append({"role": role, "content": m.content})

            resp = await self._client.chat.completions.create(
                model=self._model,
                messages=mapped,
            )
            content = resp.choices[0].message.content
            latency_ms = int((time.time() - start) * 1000)
            return AIMessage(content=content), latency_ms

    return GradientChatModel(client=client, model=model_id)


async def agent_node(state: AgentState, config: RunnableConfig | None = None) -> AgentState:
    """
    Main LLM decision node.
    Uses persona system prompt and can decide to call tools.
    """
    persona = state["persona"]
    system_prompt = PERSONA_SYSTEM_PROMPTS[persona]

    messages = [SystemMessage(content=system_prompt)] + state["messages"]

    llm = _build_llm_with_tools()

    logger.info("Invoking LLM for persona=%s", persona)

    ai_message, latency_ms = await llm.ainvoke(messages, config=config)

    new_messages = state["messages"] + [ai_message]
    meta = dict(state.get("meta", {}))
    meta["last_latency_ms"] = latency_ms

    return {
        "messages": new_messages,
        "persona": persona,
        "meta": meta,
    }


def build_workflow():
    """
    Build a LangGraph workflow with tools and routing.
    This is what the entrypoint will invoke.
    """
    tools = [calculator_tool, product_lookup_tool]

    graph = StateGraph(AgentState)

    graph.add_node("agent", agent_node)
    graph.add_node("tools", ToolNode(tools))

    graph.set_entry_point("agent")
    graph.add_conditional_edges(
        "agent",
        tools_condition,
        {"tools": "tools", END: END},
    )
    graph.add_edge("tools", "agent")

    workflow = graph.compile()
    return workflow

