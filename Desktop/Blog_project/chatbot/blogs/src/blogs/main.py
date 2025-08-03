from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from blogs.crew import BlogsCrew
import traceback
import asyncio


class BlogGenerationRequest(BaseModel):
    topic: str
    tone: str = "professional"
    target_audience: str = "a general audience"

app = FastAPI(
    title="AI Social Blogging App Backend",
    description="An API for generating blog posts using a CrewAI multi-agent system."
)

@app.post("/api/generate-blog")
async def generate_blog(request: BlogGenerationRequest):
    """Receives a topic, creates, and runs the Blogs crew."""
    try:
        print(f"Received request to generate blog for topic: {request.topic}")
        crew_setup = BlogsCrew(
            topic=request.topic,
            tone=request.tone,
            target_audience=request.target_audience
        )
        blog_crew = crew_setup.setup_crew()
        result = await asyncio.get_event_loop().run_in_executor(
            None, blog_crew.kickoff
        )
        print("Crew execution finished successfully.")
        if hasattr(result, 'raw'):
            return {"blog_post": result.raw}
        else:
            return {"blog_post": str(result)}

    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while running the crew: {e}"
        )

@app.get("/")
def read_root():
    return {"message": "AI Social Blogging App Backend is running!"}

