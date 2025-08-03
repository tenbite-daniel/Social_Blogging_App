FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y curl gcc build-essential && \
  curl https://sh.rustup.rs -sSf | sh -s -- -y && \
  . "$HOME/.cargo/env"

RUN curl -LsSf https://astral.sh/uv/install.sh | sh

COPY . .

COPY pyproject.toml .

RUN ~/.cargo/bin/uv pip install .


EXPOSE 8000

CMD ["uvicorn", "blogs.main:app", "--host", "0.0.0.0", "--port", "8000"]
