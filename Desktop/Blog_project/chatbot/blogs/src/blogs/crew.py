import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM
from blogs.tools.custom_tool import MyCustomTool

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("CRITICAL: GOOGLE_API_KEY not found in .env file. The server cannot start.")

llm_config = {
    "api_key": GOOGLE_API_KEY,
    "temperature": 0.7,
}

llm = LLM(
    model="gemini/gemini-1.5-flash",
    config=llm_config
)

rag_tool = MyCustomTool(api_key=GOOGLE_API_KEY)

class BlogsCrew:
    def __init__(self, topic: str, tone: str, target_audience: str):
        self.topic = topic
        self.tone = tone
        self.target_audience = target_audience
        self.current_year = "2025"

    def setup_crew(self):
        researcher = Agent(
            role=f'{self.topic} Trend Researcher',
            goal=f'Identify trending and highly engaging developments in {self.topic}...',
            backstory=f"You're a seasoned social media researcher...",
            llm=llm,
            verbose=True,
            allow_delegation=False
        )
        writer = Agent(
            role=f'{self.topic} Expert Content Creator',
            goal=f'Write an insightful, well-structured, and engaging blog post...',
            backstory="You are a seasoned blog writer...",
            llm=llm,
            tools=[rag_tool],
            verbose=True,
            allow_delegation=False
        )
        editor = Agent(
            role=f'{self.topic} Content Editor',
            goal='Review and refine the blog post...',
            backstory="You are a grammar purist...",
            llm=llm,
            verbose=True,
            allow_delegation=False
        )
        summarizer = Agent(
            role=f'{self.topic} SEO and Marketing Specialist',
            goal='Create concise, compelling metadata...',
            backstory="You are an expert in digital marketing...",
            llm=llm,
            verbose=True,
            allow_delegation=False
        )

        research_task = Task(description=f"Analyze current trends related to the topic: {self.topic}...", expected_output='A relevant blog post topic...', agent=researcher)
        writing_task = Task(description=f"Using the research findings..., write a full blog post...", expected_output=f'A fully fledged blog post...', agent=writer, context=[research_task])
        editing_task = Task(description=f"Review the provided blog post...", expected_output='A fully fledged blog post...', agent=editor, context=[writing_task])
        summarizing_task = Task(description="From the final edited blog post, generate...", expected_output='A JSON object with stated keys...', agent=summarizer, context=[editing_task])

        return Crew(
            agents=[researcher, writer, editor, summarizer],
            tasks=[research_task, writing_task, editing_task, summarizing_task],
            process=Process.sequential,
            verbose=True
        )