# 1. Start from the official Python image
# This is the crucial line that was missing.
FROM python:3.11-slim

# 2. Set the PATH environment variable to include Rust and uv's bin directories
# This makes 'cargo', 'rustc', and 'uv' available in subsequent commands.
ENV PATH="/root/.cargo/bin:/root/.local/bin:${PATH}"

# 3. Set the working directory in the container
WORKDIR /app
ENV PYTHONPATH /app

# 4. Install system dependencies
# This is a good layer to cache.
RUN apt-get update && \
  apt-get install -y --no-install-recommends curl gcc build-essential && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# 5. Install Rust
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

# 6. Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

# 7. Copy your requirements file and install dependencies
# This is cached separately from your app code for faster builds.
COPY ./requirements.txt /app/requirements.txt
RUN uv pip install -r requirements.txt --system

# 8. Copy the rest of your application code
COPY . /app

# 9. Specify the command to run your application
# (This is an example for a FastAPI app, adjust it to your actual command)
CMD ["uvicorn", "blogs.src.blogs.main:app", "--host", "0.0.0.0", "--port", "8000"]



