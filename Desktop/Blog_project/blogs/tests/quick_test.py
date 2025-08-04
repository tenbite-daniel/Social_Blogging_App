import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM

def quick_test():
    """Quick test with just the LLM, no RAG tool."""
    
    load_dotenv()
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print("No API key found!")
        return
    
    print(f"Testing with API key: {api_key[:10]}...{api_key[-4:]}")
    
    llm = LLM(
        model="gemini/gemini-1.5-flash",
        api_key=api_key,
        temperature=0.7
    )
    
    agent = Agent(
        role="Test Writer",
        goal="Write a short paragraph about AI",
        backstory="You are a test writer.",
        llm=llm,
        verbose=True
    )
    
    task = Task(
        description="Write a short paragraph about artificial intelligence trends in 2025.",
        expected_output="A paragraph about AI trends.",
        agent=agent
    )
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        process=Process.sequential,
        verbose=True
    )
    
    print(" Running simple test...")
    result = crew.kickoff()
    print("Test completed!")
    print("Result:", result)

if __name__ == "__main__":
    quick_test()