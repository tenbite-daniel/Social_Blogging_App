import json
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field

class FormattedBlogInput(BaseModel):
    topic: str = Field(description="The core subject of the blog post. This should be specific and descriptive.")
    tone: str = Field(description="The desired tone or style of the blog post (e.g., professional, funny, casual, inspirational).")
    target_audience: str = Field(description="The specific group of people the blog post is intended for (e.g., a general audience, software developers, new parents).")

class PromptFormatter:
    def __init__(self, llm: ChatGoogleGenerativeAI):
        self.llm = llm

    def _create_formatter_prompt(self, user_prompt: str) -> str:
        return f"""
        You are an expert AI assistant that analyzes a user's request for a blog post and extracts the key parameters.
        Your goal is to populate a JSON object with the 'topic', 'tone', and 'target_audience'.

        Instructions:
        1. Analyze the User Prompt: Carefully read the user's request below.
        2. Extract 'topic': Identify the main subject.
        3. Extract 'tone': Default to 'professional' if missing.
        4. Extract 'target_audience': Default to 'a general audience' if missing.
        5. Format Output: MUST be a single, valid JSON object.

        User Prompt: "{user_prompt}"
        """

    def format_prompt(self, user_prompt: str) -> FormattedBlogInput:
        formatter_prompt = self._create_formatter_prompt(user_prompt)

        print("--- Sending prompt to Formatter LLM ---")
        response = self.llm.invoke(formatter_prompt)
        print(f"--- Received raw response from Formatter LLM: ---\n{response.content}")

        try:
            cleaned = response.content.strip().strip('```json').strip('```')
            extracted_data = json.loads(cleaned)
            validated_data = FormattedBlogInput(**extracted_data)
            return validated_data
        except (json.JSONDecodeError, TypeError, KeyError) as e:
            print(f"Error parsing LLM response for prompt formatting: {e}\nRaw: {response.content}")
            raise ValueError("Failed to get a valid structured response from the formatting LLM.")