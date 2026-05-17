import yaml
from pathlib import Path
from openai import OpenAI
from typing import Optional


class LLMService:
    def __init__(self, config_path: Optional[str] = None):
        if config_path is None:
            config_path = Path(__file__).parent.parent.parent / "config" / "llm_api.yaml"

        with open(config_path, "r", encoding="utf-8") as f:
            config = yaml.safe_load(f)

        self.api_key = config["api_key"]
        self.base_url = config["base_url"]
        self.model = config["model"]
        self.max_tokens = config.get("max_tokens", 2048)
        self.temperature = config.get("temperature", 0.7)

        self.client = OpenAI(
            api_key=self.api_key,
            base_url=self.base_url
        )

    def chat(self, messages: list[dict]) -> str:
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            max_tokens=self.max_tokens,
            temperature=self.temperature
        )

        return response.choices[0].message.content


llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    global llm_service
    if llm_service is None:
        llm_service = LLMService()
    return llm_service


def init_llm_service(config_path: Optional[str] = None) -> LLMService:
    global llm_service
    llm_service = LLMService(config_path)
    return llm_service
