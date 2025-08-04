import os
import time
from dotenv import load_dotenv, find_dotenv
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM
from .tools.custom_tool import MyCustomTool
from .tools.serpapi_tool import SerpAPITool

dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)
else:
    load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")
else:
    print(f"Google API key loaded.")

if not SERPAPI_API_KEY:
    print("SERPAPI_API_KEY not found. Trend research will be limited.")
    serpapi_available = False
else:
    print(f"SerpAPI key loaded.")
    serpapi_available = True

llm = LLM(
    model="gemini/gemini-1.5-flash",
    api_key=GOOGLE_API_KEY,
    temperature=0.7,
    max_retries=3,
    timeout=120, 
    request_delay=2, 
)

class BlogsCrew:
    def __init__(self, topic: str, tone: str, target_audience: str):
        self.topic = topic
        self.tone = tone
        self.target_audience = target_audience
        self.current_year = "2025"
        self.request_count = 0
        self.last_request_time = 0
        
        try:
            self.rag_tool = MyCustomTool(api_key=GOOGLE_API_KEY)
        except Exception as e:
            print(f"Warning: RAG tool initialization failed: {e}")
            self.rag_tool = None
        
        try:
            if serpapi_available:
                self.serpapi_tool = SerpAPITool(api_key=SERPAPI_API_KEY)
            else:
                self.serpapi_tool = None
        except Exception as e:
            print(f"Warning: SerpAPI tool initialization failed: {e}")
            self.serpapi_tool = None

    def _apply_rate_limiting(self):
        """Apply rate limiting between API calls"""
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        
        min_delay = 2.0
        if time_since_last_request < min_delay:
            sleep_time = min_delay - time_since_last_request
            print(f"Rate limiting: sleeping {sleep_time:.1f} seconds...")
            time.sleep(sleep_time)
        
        if self.request_count > 0 and self.request_count % 5 == 0:
            backoff_time = min(10, self.request_count * 0.5)  # Max 10 seconds
            print(f"Progressive backoff: sleeping {backoff_time:.1f} seconds...")
            time.sleep(backoff_time)
        
        self.request_count += 1
        self.last_request_time = time.time()

    def _create_rate_limited_agent(self, role, goal, backstory, tools=None, verbose=True):
        """Create an agent with rate limiting applied"""
        return Agent(
            role=role,
            goal=goal,
            backstory=backstory,
            llm=llm,
            tools=tools or [],
            verbose=verbose,
            allow_delegation=False,
            execution_callback=lambda: self._apply_rate_limiting()
        )

    def setup_crew(self):
        self._apply_rate_limiting()
        
        researcher_tools = []
        if self.serpapi_tool:
            researcher_tools.append(self.serpapi_tool)
        
        print("Creating researcher agent...")
        researcher = self._create_rate_limited_agent(
            role=f'{self.topic} Trend Researcher',
            goal=f'Identify trending and highly engaging developments in {self.topic} that would make for compelling blog content in {self.current_year}.',
            backstory=f"""You're a seasoned social media researcher with expertise in {self.topic}. 
            You have an eye for spotting emerging trends and viral topics that resonate with audiences. 
            Your research helps content creators stay ahead of the curve. You use search tools to find 
            real-time trending information, recent news, and popular discussions around your topic.""",
            tools=researcher_tools
        )
        time.sleep(1)
        
        writer_tools = [self.rag_tool] if self.rag_tool else []
        writer_backstory = """You are a seasoned blog writer who creates compelling content that educates and engages readers. 
        You know how to structure articles for maximum readability and impact. When using the RAG Search Tool, 
        pass simple, clear search queries as strings to find relevant examples and style guides."""
        
        print("Creating writer agent...")
        writer = self._create_rate_limited_agent(
            role=f'{self.topic} Expert Content Creator',
            goal=f'Write an insightful, well-structured, and engaging blog post about {self.topic} using a {self.tone} tone for {self.target_audience}.',
            backstory=writer_backstory,
            tools=writer_tools
        )
        
        time.sleep(1)
        
        print("Creating editor agent...")
        editor = self._create_rate_limited_agent(
            role=f'{self.topic} Content Editor',
            goal='Review and refine the blog post for clarity, flow, grammar, and engagement while maintaining the intended tone.',
            backstory="You are a grammar purist and content strategist who ensures every piece of content meets the highest editorial standards. You improve readability and ensure the message resonates with the target audience."
        )
        
        time.sleep(1)
        
        print("Creating summarizer agent...")
        summarizer = self._create_rate_limited_agent(
            role=f'{self.topic} SEO and Marketing Specialist',
            goal='Create concise, compelling metadata and summaries that will help the blog post perform well on social media and search engines.',
            backstory="You are an expert in digital marketing and SEO who knows how to craft titles, descriptions, and hashtags that drive engagement and discoverability."
        )

        research_task = Task(
            description=f"""Research current trends and developments related to: {self.topic}
            
            Use the Search Trends Tool to find:
            1. Recent news and developments about {self.topic}
            2. Trending discussions and viral content related to {self.topic}
            3. Popular questions people are asking about {self.topic}
            4. Emerging subtopics or angles within {self.topic}
            
            Search queries to try:
            - "{self.topic} trends {self.current_year}"
            - "{self.topic} news latest"
            - "what's new in {self.topic}"
            - "{self.topic} viral" or "{self.topic} popular"
            
            Analyze the results to identify:
            - What's currently trending and why
            - What angles would be most engaging for {self.target_audience}
            - Recent developments that would make compelling blog content
            - Questions and pain points your audience has
            
            Focus on finding a specific, compelling angle that would make readers want to click and read.
            
            IMPORTANT: Take breaks between API calls to avoid rate limits.""",
            expected_output="""A comprehensive research report including:
            - 3-5 trending angles or developments related to the topic
            - Key questions people are asking
            - Recent news or viral content
            - Recommended blog post angle with rationale
            - Relevant statistics, quotes, or data points from search results""",
            agent=researcher
        )
        
        writing_task = Task(
            description=f"""Using the research findings, write a full blog post about {self.topic}.
            The tone should be {self.tone} and aimed at {self.target_audience}.
            
            If you have access to the RAG Search Tool, use it to find relevant examples and style guides by searching for:
            - "blog writing examples for {self.target_audience}"
            - "{self.topic} content style guides"
            - "engaging {self.tone} writing samples"
            
            Structure the post with:
            - Engaging headline that reflects current trends
            - Compelling introduction that hooks the reader with trending information
            - Well-organized main content with clear sections
            - Include recent developments and trending information from research
            - Practical insights or takeaways
            - Strong conclusion
            
            Make it timely, informative, engaging, and valuable to readers. Aim for 800-1200 words.
            
            IMPORTANT: Work efficiently to minimize API calls.""",
            expected_output='A complete, well-structured blog post with headline, introduction, main content sections, and conclusion that incorporates trending information.',
            agent=writer,
            context=[research_task]
        )
        
        editing_task = Task(
            description=f"""Review the provided blog post and improve it for:
            - Grammar and spelling accuracy
            - Clarity and readability
            - Flow and structure
            - Engagement and compelling language
            - Consistency with the {self.tone} tone
            - Appeal to {self.target_audience}
            - Timeliness and relevance of trending information
            
            Make specific improvements while maintaining the original message and structure.
            
            IMPORTANT: Be concise in your edits to minimize processing time.""",
            expected_output='A polished, edited blog post with improved clarity, grammar, and engagement.',
            agent=editor,
            context=[writing_task]
        )
        
        summarizing_task = Task(
            description="""From the final edited blog post, generate SEO-friendly metadata including:
            - A compelling, SEO-optimized title (under 60 characters)
            - A meta description (under 160 characters) that highlights trending aspects
            - 5-8 relevant hashtags including trending ones
            - A brief summary (2-3 sentences)
            
            Format the output as a JSON object with keys: title, meta_description, hashtags, summary, and full_content.
            
            IMPORTANT: Generate this efficiently in a single response.""",
            expected_output='A JSON object with keys: title, meta_description, hashtags, summary, and full_content containing all the blog metadata and content.',
            agent=summarizer,
            context=[editing_task]
        )

        print("Creating crew with rate-limited agents...")
        return Crew(
            agents=[researcher, writer, editor, summarizer],
            tasks=[research_task, writing_task, editing_task, summarizing_task],
            process=Process.sequential,
            verbose=True,
            max_execution_time=300, 
            memory=False
        )