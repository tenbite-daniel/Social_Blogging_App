import asyncio
from blogs.crew import BlogsCrew

async def test_crew():
    """Test the CrewAI setup with a simple topic."""
    
    print("Testing CrewAI setup...")
    
    try:
        crew_setup = BlogsCrew(
            topic="artificial intelligence",
            tone="professional",
            target_audience="tech enthusiasts"
        )
        
        blog_crew = crew_setup.setup_crew()
        print("✅ Crew setup completed")
        
        print("🔄 Running crew... (this may take 2-5 minutes)")
        result = await asyncio.get_event_loop().run_in_executor(
            None, blog_crew.kickoff
        )
        
        print("Crew execution completed!")
        print("\n" + "="*50)
        print("RESULT:")
        print("="*50)
        
        if hasattr(result, 'raw'):
            print(result.raw)
        else:
            print(result)
            
    except Exception as e:
        print(f"Error during crew execution: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_crew())