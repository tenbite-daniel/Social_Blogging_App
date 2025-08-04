from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from .crew import BlogsCrew
from .prompt_parser import PromptFormatter
from langchain_google_genai import ChatGoogleGenerativeAI 
import traceback
import asyncio
import json
import os

class BlogGenerationRequest(BaseModel):
    topic: str
    tone: str = "professional"
    target_audience: str = "a general audience"

class FreestylePromptRequest(BaseModel):
    prompt: str

app = FastAPI(
    title="AI Social Blogging App Backend",
    description="An API for generating blog posts using a CrewAI multi-agent system."
)

def get_prompt_formatter():
    return PromptFormatter(
        llm=ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=os.getenv("GOOGLE_API_KEY")
        )
    )

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/api/generate-blog-from-prompt", tags=["Blog Generation"])
async def generate_blog_from_prompt(
    request: FreestylePromptRequest,
    formatter: PromptFormatter = Depends(get_prompt_formatter)
):
    try:
        print(f"Received freestyle prompt: '{request.prompt}'")
        structured_input = formatter.format_prompt(request.prompt)

        crew_request = BlogGenerationRequest(
            topic=structured_input.topic,
            tone=structured_input.tone,
            target_audience=structured_input.target_audience
        )

        return await generate_blog(crew_request)

    except ValueError as ve:
         raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"An error occurred during prompt formatting or crew execution: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

@app.post("/api/generate-blog", tags=["Blog Generation"])
async def generate_blog(request: BlogGenerationRequest):
    try:
        print(f"Received structured request to generate blog for topic: {request.topic}")
        crew_setup = BlogsCrew(
            topic=request.topic,
            tone=request.tone,
            target_audience=request.target_audience
        )

        if not crew_setup.rag_tool and not crew_setup.serpapi_tool:
            raise HTTPException(status_code=500, detail="No knowledge tools available (RAG and SerpAPI failed).")

        blog_crew = crew_setup.setup_crew()
        result = await asyncio.to_thread(blog_crew.kickoff)

        print("Crew execution finished successfully.")

        if isinstance(result, str):
            try:
                import re
                json_match = re.search(r'{.*}', result.strip(), re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
                return {"blog_post": result}
            except json.JSONDecodeError:
                print("Warning: Failed to parse final output as JSON. Returning as string.")
                return {"blog_post": result}

        return result

    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An error occurred while running the crew: {e}")

@app.get("/")
def read_root():
    return {"message": "AI Social Blogging App Backend is running!"}

