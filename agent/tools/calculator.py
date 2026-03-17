from langchain_core.tools import tool


@tool
def calculator_tool(expression: str) -> str:
    """Safely evaluate a simple math expression, e.g. '2 + 2 * 3'."""
    try:
        allowed_chars = "0123456789+-*/(). "
        if not all(c in allowed_chars for c in expression):
            return "Expression contains unsupported characters."
        result = eval(expression, {"__builtins__": {}}, {})
        return str(result)
    except Exception as e:  # noqa: BLE001
        return f"Error evaluating expression: {e}"

