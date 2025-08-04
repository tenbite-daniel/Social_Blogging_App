from .main import app

# For debugging or local run with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("blogs.main:app", host="0.0.0.0", port=8000, reload=True)
