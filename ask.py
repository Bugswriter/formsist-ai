import argparse
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

def main():
    # 1. Argument Parsing
    parser = argparse.ArgumentParser(
        description="Query your personal portfolio information using Gemini and LangChain."
    )
    parser.add_argument(
        "portfolio_file",
        type=str,
        help="Path to the text file containing your portfolio information (e.g., my-portfolio-info.txt)",
    )
    parser.add_argument(
        "query",
        type=str,
        help="The natural language query about your portfolio information (e.g., 'whats my email and how many years of experience I have')",
    )
    args = parser.parse_args()

    portfolio_file_path = args.portfolio_file
    user_query = args.query

    # 2. Get Gemini API Key from Environment Variable
    # It's recommended to set this as an environment variable:
    # export GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
    try:
        gemini_api_key = os.environ["GOOGLE_API_KEY"]
    except KeyError:
        print("Error: GOOGLE_API_KEY environment variable not set.")
        print("Please set it (e.g., export GOOGLE_API_KEY='your_api_key_here')")
        return

    # 3. System Prompt
    # This prompt instructs the AI on its role and how to use the provided information.
    system_prompt = """
    You are an intelligent assistant designed to answer questions based on the provided personal portfolio information.
    Your goal is to extract relevant details from the given text and respond accurately and concisely to the user's queries.
    If the information is not explicitly present in the provided portfolio text, state that you cannot find the answer.
    Do not make up information.
    """

    # 4. Load Portfolio Information from File
    try:
        with open(portfolio_file_path, "r", encoding="utf-8") as f:
            portfolio_info = f.read()
        
        if not portfolio_info.strip():
            print(f"Warning: The portfolio file '{portfolio_file_path}' is empty.")
            return

    except FileNotFoundError:
        print(f"Error: Portfolio information file not found at '{portfolio_file_path}'")
        return
    except Exception as e:
        print(f"Error reading portfolio file: {e}")
        return

    # 5. Initialize LLM (Gemini Model)
    # Using gemini-1.5-flash as it's a strong and cost-effective model
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=gemini_api_key)

    # 6. Build Prompt Template (Corrected)
    # This new template structure is clearer for the model.
    # It uses placeholders {portfolio_info} and {query} which will be filled in at runtime.
    prompt_template = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("human", "Here is the personal portfolio information:\n\n{portfolio_info}\n\n---\n\nBased on the information above, please answer my query: {query}")
        ]
    )
    
    # 7. Use a simple String Output Parser
    # This ensures the final output is a clean string, not a message object.
    output_parser = StrOutputParser()

    # 8. Create LangChain RunnableSequence (LCEL)
    chain = prompt_template | llm | output_parser

    # 9. Invoke the Chain with the User's Query
    print(f"Querying Gemini with your question...")
    try:
        # Pass a dictionary with keys matching the placeholders in the prompt
        response = chain.invoke({
            "portfolio_info": portfolio_info, 
            "query": user_query
        })
        print("\n--- Gemini's Response ---")
        print(response.strip())
        print("-------------------------")
    except Exception as e:
        print(f"An error occurred during the API call: {e}")

if __name__ == "__main__":
    main()
