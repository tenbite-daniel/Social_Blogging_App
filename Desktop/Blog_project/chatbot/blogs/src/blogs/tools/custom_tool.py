from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings

class MyCustomToolInput(BaseModel):
    argument: str = Field(..., description="The search query for the knowledge base.")

class MyCustomTool(BaseTool):
    name: str = "RAG Search Tool"
    description: str = "Retrieves context from blog post examples and style guides."
    args_schema: Type[BaseModel] = MyCustomToolInput
    api_key: str 
    embedding_model: GoogleGenerativeAIEmbeddings = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.embedding_model = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=self.api_key
        )

    def _run(self, argument: str) -> str:
        DB_SAVE_PATH = "faiss_index"
        vector_db = FAISS.load_local(
            DB_SAVE_PATH,
            embeddings=self.embedding_model,
            allow_dangerous_deserialization=True
        )
        retriever = vector_db.as_retriever(search_kwargs={"k": 2})
        docs = retriever.invoke(argument)
        return "\n".join([doc.page_content for doc in docs])
        
