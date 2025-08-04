from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os

class MyCustomToolInput(BaseModel):
    query: str = Field(..., description="The search query for the knowledge base.")

class MyCustomTool(BaseTool):
    name: str = "RAG Search Tool"
    description: str = "Retrieves context from blog post examples and style guides to help with content creation."
    args_schema: Type[BaseModel] = MyCustomToolInput
    api_key: str 
    embedding_model: GoogleGenerativeAIEmbeddings = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.embedding_model = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=self.api_key
        )

    def _run(self, query: str) -> str:
        """
        Execute the RAG search with the provided query.
        
        Args:
            query (str): The search query string
            
        Returns:
            str: Retrieved context or error message
        """
        try:
            DB_SAVE_PATH = "faiss_index"
            if not os.path.exists(DB_SAVE_PATH):
                return f"Knowledge base not found at {DB_SAVE_PATH}. Please create the FAISS index first."
            
            vector_db = FAISS.load_local(
                DB_SAVE_PATH,
                embeddings=self.embedding_model,
                allow_dangerous_deserialization=True
            )
            
            retriever = vector_db.as_retriever(search_kwargs={"k": 3})
            docs = retriever.invoke(query)
            
            if not docs:
                return "No relevant information found in the knowledge base."
            
            context = "\n---\n".join([doc.page_content for doc in docs])
            return f"Retrieved context for '{query}':\n{context}"
            
        except Exception as e:
            return f"Error retrieving from knowledge base: {str(e)}"

    async def _arun(self, query: str) -> str:
        """Async version of the run method."""
        return self._run(query)
        
