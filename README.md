# 🚀 Formsist AI

A smart AI assistant that uses **Google Gemini** and **LangChain** to auto-fill HTML forms based on your personal portfolio.

🎯 Goal: Make forms feel less like paperwork and more like magic.

---

## ✨ Features

* 🤖 **AI-powered answers** based on your personal data
* 🧠 **Context-aware replies** using Gemini + LangChain
* 🧩 **CLI Tool** to ask questions about your life/resume
* 🌐 **Planned browser extension** for real-time form-filling

---

## 🔧 Backend CLI (Working Now)

> Located in `backend/` folder

### 📥 Install

```bash
git clone https://github.com/bugswriter/formsist-ai.git
cd formsist-ai/backend

python -m venv env
source env/bin/activate      # Windows: .\env\Scripts\activate

pip install langchain langchain-google-genai
```

### 🔑 Setup Gemini API Key

Get it from [Google AI Studio](https://aistudio.google.com/app/apikey)

```bash
export GOOGLE_API_KEY="your_key_here"    # Linux/macOS
# or
set GOOGLE_API_KEY="your_key_here"       # Windows
```

### 📄 Add Portfolio Info

Create a file `portfolio.txt` like:

```
Name: Jane Doe
Email: jane@example.com
Skills: Python, FastAPI, React
Experience: 5 years in web dev
```

### 💬 Ask Questions

```bash
python ask.py portfolio.txt "What's my email? How much experience do I have?"
```

---

## 🧩 Browser Extension (Coming Soon)

A Chrome/Firefox extension that:

* 🖱️ Clicks into forms
* 🪄 Auto-fills them using your portfolio
* 📡 Talks to the backend

---

## 🤝 Contributing

Pull requests and ideas welcome!
Let’s build something useful together 💡

---

## 📜 License

Licensed under **GPL v3**
See `LICENSE` for details.
