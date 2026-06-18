import os

from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1",
)


async def chat(model: str, messages: list):
    response = await client.chat.completions.create(
        model=model,
        messages=messages,
        extra_headers={
            "HTTP-Referer": os.getenv("APP_URL"),
            "X-Title": os.getenv("APP_NAME"),
        },
    )

    return response.choices[0].message.content