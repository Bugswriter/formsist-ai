# Formsist AI

A smart assistant that leverages Google Gemini and LangChain to intelligently fill HTML forms based on your personal portfolio information. This repository contains both the backend CLI tool for querying personal data and a planned browser extension for automated form filling.

## Table of Contents

* [Features](#features)
* [Backend CLI](#backend-cli)
    * [Installation](#backend-installation)
    * [Usage](#backend-usage)
* [Browser Extension](#browser-extension)
    * [Installation](#extension-installation)
    * [Usage](#extension-usage)
* [Contributing](#contributing)
* [License](#license)

## Features

* **Intelligent Data Retrieval:** Query your personal portfolio information using natural language.
* **Contextual Responses:** Gemini provides answers based on the detailed personal data you supply.
* **Automated Form Filling (Planned):** A browser extension will utilize the backend's capabilities to intelligently populate web forms.
* **Modular & Extensible:** Built with LangChain for easy expansion and integration with other tools.

## Backend CLI

The `backend` directory contains the Python CLI tool that interacts with the Gemini API to answer questions about your personal portfolio.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/formsist-ai.git](https://github.com/your-username/formsist-ai.git)
    cd formsist-ai/backend
    ```

2.  **Create a virtual environment (recommended):**
    ```bash
    python -m venv env
    source env/bin/activate  # On Windows: .\env\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    (You'll need to create a `requirements.txt` file with `langchain-google-genai` and `langchain` in it, or you can run `pip install langchain-google-genai langchain` directly.)

4.  **Set your Google Gemini API Key:**
    Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    Set it as an environment variable:
    * **Linux/macOS:**
        ```bash
        export GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
        ```
    * **Windows (Command Prompt):**
        ```cmd
        set GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
        ```
    * **Windows (PowerShell):**
        ```powershell
        $env:GOOGLE_API_KEY="YOUR_GEMINI_API_KEY"
        ```

### Usage

1.  **Create your portfolio information file:**
    Inside the `backend/` directory, create a file named `portfolio.txt` (or any other name you prefer). Populate it with your personal details.

    **Example `portfolio.txt`:**
    ```
    Name: Jane Doe
    Email: jane.doe@example.com
    Phone: +1-234-567-8900
    Employment History:
    - Senior Software Engineer at InnovateCorp (Jan 2022 - Present) - 2.5 years experience. Led development of cloud-native applications.
    - Software Developer at StartupX (Jul 2019 - Dec 2021) - 2.5 years experience. Built RESTful APIs.
    Skills: Python, FastAPI, React, AWS, Docker, Kubernetes, SQL, NoSQL
    Education: M.S. in Computer Science from Tech University (2019)
    ```

2.  **Run the CLI tool:**
    Navigate to the `backend/` directory in your terminal and execute the `ask.py` script:
    ```bash
    python ask.py portfolio.txt "whats my email? & how many years of experience I have?"
    ```
    Replace `"portfolio.txt"` with the actual path to your file and the query with your desired question.

## Browser Extension (Planned)

The `extension` directory will contain the code for a browser extension (e.g., for Chrome, Firefox) that will provide a user interface to interact with the backend server for form filling.

### Installation

*(Details to be added once the extension is developed)*
Typically involves:
1.  Downloading the extension files.
2.  Loading the unpacked extension in your browser's extension management page.

### Usage

*(Details to be added once the extension is developed)*
Expected usage:
1.  Clicking the extension icon on a web page with a form.
2.  Initiating the form-filling process, potentially selecting which data to use.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests. This is a Free and Open Source Software (FOSS) project.

## License

This project is licensed under the **GNU General Public License v3.0**. See the `LICENSE` file for full details.
