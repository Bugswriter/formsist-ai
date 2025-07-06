# rag_portfolio.py
import os
import google.generativeai as genai
from langchain_core.messages import HumanMessage, AIMessage
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import StrOutputParser

class PortfolioChatAgent:
    def __init__(self, portfolio_file_path: str, api_key: str, prompt_file_path: str):
        self.portfolio_file_path = portfolio_file_path
        self.api_key = api_key
        self.prompt_file_path = prompt_file_path
        self.portfolio_info = ""
        # self.resume_pdf_url = None # Removed
        self.chat_history = []
        self.llm = None
        self.chain = None
        self._load_portfolio_info()
        self._load_system_prompt()
        self._initialize_gemini()

    def _load_portfolio_info(self):
        try:
            with open(self.portfolio_file_path, "r", encoding="utf-8") as f:
                self.portfolio_info = f.read()

            # Removed logic for extracting Resume_PDF_URL

            if not self.portfolio_info.strip():
                print(f"Warning: The portfolio file '{self.portfolio_file_path}' is empty.")

        except FileNotFoundError:
            raise FileNotFoundError(f"Portfolio information file not found at '{self.portfolio_file_path}'")
        except Exception as e:
            raise Exception(f"Error reading portfolio file: {e}")

    def _load_system_prompt(self):
        try:
            with open(self.prompt_file_path, "r", encoding="utf-8") as f:
                self.system_prompt = f.read().strip()
            if not self.system_prompt:
                raise ValueError(f"Prompt file '{self.prompt_file_path}' is empty.")
        except FileNotFoundError:
            raise FileNotFoundError(f"Prompt file not found at '{self.prompt_file_path}'")
        except Exception as e:
            raise Exception(f"Error reading prompt file: {e}")

    def _initialize_gemini(self):
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not set.")

        genai.configure(api_key=self.api_key)

        self.llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=self.api_key)
        output_parser = StrOutputParser()

        self.chat_history = [
            HumanMessage(content=f"Here is my portfolio information. Use this as the primary source to answer all my subsequent questions and to generate form-filling JavaScript:\n\n{self.portfolio_info}"),
            AIMessage(content="Thank you. I have loaded the portfolio information. I am ready to generate form-filling scripts based on it."),
        ]

        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", self.system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "Here is the HTML form structure to fill:\n{form_html}")
        ])

        self.chain = self.prompt_template | self.llm | output_parser

    def generate_form_filling_script(self, form_html: str) -> str:
        response = self.chain.invoke({
            "chat_history": self.chat_history,
            "form_html": form_html,
            # "Resume_PDF_URL": self.resume_pdf_url # Removed
        })
        return response
