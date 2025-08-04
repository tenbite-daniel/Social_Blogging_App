import os
from dotenv import load_dotenv
from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings
load_dotenv()

SOURCE_DOCUMENT = os.path.join("knowledge", "context.txt")
DB_SAVE_PATH = "faiss_index"

def build_and_save_vector_store():
    """
    Builds the vector store from the source document and saves it to disk.
    You only need to run this once, or whenever the source document changes.
    """
    print("--- Starting Vector Store Ingestion ---")
    print(f"1. Initializing embedding model...")
    embedding_model = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )

    print(f"2. Loading document: {SOURCE_DOCUMENT}...")
    loader = TextLoader(SOURCE_DOCUMENT, encoding="utf-8")
    documents = loader.load()

    print(f"3. Splitting document into chunks...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(documents)
    if not chunks:
        print("Error: No chunks were created from the document. Please check the content.")
        return

    print(f"4. Creating vector store from chunks...")
    vector_db = FAISS.from_documents(documents=chunks, embedding=embedding_model)

    print(f"5. Saving vector store to: {DB_SAVE_PATH}...")
    vector_db.save_local(DB_SAVE_PATH)

    print("--- Ingestion Complete! ---")
    print(f"Vector store has been successfully saved to '{DB_SAVE_PATH}'.")


if __name__ == "__main__":
    build_and_save_vector_store()