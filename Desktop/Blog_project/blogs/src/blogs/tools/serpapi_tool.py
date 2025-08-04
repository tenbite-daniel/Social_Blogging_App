from crewai.tools import BaseTool
from typing import Type, Optional
from pydantic import BaseModel, Field
from serpapi import GoogleSearch
import json

class SerpAPIToolInput(BaseModel):
    query: str = Field(..., description="The search query to find trending information")
    search_type: str = Field(default="search", description="Type of search: 'search', 'news', 'shopping', etc.")
    location: str = Field(default="United States", description="Geographic location for search results")
    num_results: int = Field(default=10, description="Number of results to return (1-20)")

class SerpAPITool(BaseTool):
    name: str = "Search Trends Tool"
    description: str = "Search Google for trending topics, news, and current information to identify engaging content angles."
    args_schema: Type[BaseModel] = SerpAPIToolInput
    api_key: str
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def _run(self, query: str, search_type: str = "search", location: str = "United States", num_results: int = 10) -> str:
        """
        Execute a search using SerpAPI to find trending information.
        
        Args:
            query: Search query string
            search_type: Type of search (search, news, shopping, etc.)
            location: Geographic location for results
            num_results: Number of results to return
            
        Returns:
            Formatted search results as a string
        """
        try:
            search_params = {
                "q": query,
                "api_key": self.api_key,
                "engine": "google",
                "location": location,
                "num": min(num_results, 20), 
                "safe": "active"
            }
            
            if search_type == "news":
                search_params["tbm"] = "nws"
                search_params["tbs"] = "qdr:w"
            elif search_type == "trends":
                search_params["tbs"] = "qdr:d"
            search = GoogleSearch(search_params)
            results = search.get_dict()
            return self._format_results(results, search_type, query)
            
        except Exception as e:
            return f"Error performing search: {str(e)}"
    
    def _format_results(self, results: dict, search_type: str, query: str) -> str:
        """Format search results into a readable string."""
        if not results:
            return f"No results found for query: {query}"
        
        formatted_output = f"Search Results for '{query}' ({search_type}):\n\n"
        organic_results = results.get("organic_results", [])
        news_results = results.get("news_results", [])
        results_to_process = news_results if news_results else organic_results
        
        if not results_to_process:
            return f"No relevant results found for: {query}"
        
        for i, result in enumerate(results_to_process[:10], 1):
            title = result.get("title", "No title")
            snippet = result.get("snippet", result.get("summary", "No description"))
            link = result.get("link", "No link")
            date = result.get("date", "")
            
            formatted_output += f"{i}. **{title}**\n"
            if date:
                formatted_output += f"  {date}\n"
            formatted_output += f"  {snippet}\n"
            formatted_output += f"  {link}\n\n"
        related_searches = results.get("related_searches", [])
        if related_searches:
            formatted_output += "\nRelated Trending Searches:\n"
            for search in related_searches[:5]:
                formatted_output += f"• {search.get('query', search)}\n"
        people_also_ask = results.get("people_also_ask", [])
        if people_also_ask:
            formatted_output += "\n People Also Ask:\n"
            for question in people_also_ask[:3]:
                formatted_output += f"• {question.get('question', question)}\n"
        
        return formatted_output
    
    async def _arun(self, query: str, search_type: str = "search", location: str = "United States", num_results: int = 10) -> str:
        """Async version of the run method."""
        return self._run(query, search_type, location, num_results)