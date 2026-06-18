from pydantic import BaseModel


class ChatRequest(BaseModel):
    conversation_id: str
    agent: str
    content: str