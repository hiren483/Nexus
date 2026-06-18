from app.config.agents import AGENTS
from app.services.context_builder import build
from app.services.openrouter_service import chat


async def generate(
    conversation_id: str,
    agent: str,
    content: str,
):
    context = await build(conversation_id)

    config = AGENTS.get(agent)

    if not config:
        raise ValueError(f"Unknown agent: {agent}")

    messages = [
        {
            "role": "system",
            "content": config["system_prompt"],
        },
        *context,
        {
            "role": "user",
            "content": content,
        },
    ]

    return await chat(
        model=config["model"],
        messages=messages,
    )