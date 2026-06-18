from fastapi import APIRouter, HTTPException

from app.schemas.chat import ChatRequest
from app.services.chat_service import generate

router = APIRouter()


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = await generate(
            conversation_id=request.conversation_id,
            agent=request.agent,
            content=request.content,
        )

        return {"content": response}

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )