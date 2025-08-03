from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os


class MyCustomToolInput(BaseModel):
    """Input schema for MyCustomTool."""
    argument: str = Field(..., description="Description of the argument.")


embedding_model = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)


class MyCustomTool(BaseTool):
    name: str = "RAG Search Tool"
    description: str = (
        "This is an RAG search and retrieval tool that retrieves pre-embedded tasks from a faiss vector database. Use it to obtain context on blog post examples."
    )
    args_schema: Type[BaseModel] = MyCustomToolInput

    def _run(self, argument: str) -> str:
        DB_SAVE_PATH = "faiss_index"
        vector_db = FAISS.load_local(
            DB_SAVE_PATH,
            embeddings=embedding_model,
            allow_dangerous_deserialization=True
        )
        retriever = vector_db.as_retriever(search_kwargs={"k": 2})
        docs = retriever.invoke(argument)
        return "\n".join([doc.page_content for doc in docs])
        
