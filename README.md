# Krishi-AI
A Smart Agriculture Assistant Website

# 🌾 Krishi AI – Smart Farming Assistant

> An AI-powered crop disease diagnosis web application built with Flask and Google Gemini.  
> Describe your crop symptoms in plain language and get an instant structured diagnosis report.

![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0.3-lightgrey?style=flat-square&logo=flask)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-orange?style=flat-square&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📸 Preview

| Home / Input | Diagnosis Report |
|---|---|
| Describe symptoms in the form | AI returns disease, cause, treatment & prevention |

---

## ✨ Features

- 🤖 **AI-Powered Diagnosis** — Google Gemini analyses crop symptoms and returns a structured report
- 🦠 **4-Section Report** — Disease name, Root cause, Treatment plan, Preventive measures
- 📋 **Smart Bullet Parsing** — Treatment and prevention are automatically formatted as actionable bullet points
- ⚡ **3-Step Progress Indicator** — Visual feedback: Describe → Analyzing → Report
- 🚨 **Full Error Handling** — Inline alerts for empty input, API failures, and unclear responses
- 🔔 **Toast Notifications** — Auto-dismissing top-right notifications for success/error/warning
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🔒 **Secure by Design** — API key never exposed to the frontend; all AI calls are server-side
- 🖨️ **Print Support** — Print or save your diagnosis report

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3, Flask 3.0 |
| AI Engine | Google Gemini 1.5 Flash (`google-generativeai`) |
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Fonts | Playfair Display + Lato (Google Fonts) |
| Config | `python-dotenv` for environment variables |
| Deployment | Gunicorn (production WSGI server) |

---

## 📂 Project Structure

```
krishi-ai/
│
├── app.py                  # Flask application & Gemini API integration
├── .env                    # 🔐 Your secret API key (never commit this)
├── .env.example            # Template for environment variables
├── requirements.txt        # Python dependencies
├── .gitignore              # Excludes .env and other sensitive files
├── Procfile                # For Render / Heroku deployment
│
├── templates/
│   └── index.html          # Main page (form + result modal)
│
└── static/
    ├── style.css           # Full design system (CSS variables, responsive)
    └── script.js           # Frontend logic (validation, API call, UI state)
```

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/krishi-ai.git
cd krishi-ai
```

### 2. Create a virtual environment

```bash
# Create
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up your API key

```bash
# Copy the example file
cp .env.example .env
```

Now open `.env` and replace the placeholder:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> **Get your free Gemini API key at:** [aistudio.google.com](https://aistudio.google.com/app/apikey)

### 5. Run the application

```bash
python app.py
```

Open your browser at: **[http://localhost:5000](http://localhost:5000)**

---

## 🔐 Security

| Concern | How it's handled |
|---|---|
| API Key exposure | Stored in `.env`, loaded server-side via `python-dotenv` |
| Frontend access | The API key is **never** sent to or referenced in JavaScript |
| Git safety | `.env` is listed in `.gitignore` — will never be committed |
| Input validation | Both client-side (JS) and server-side (Flask) validation |
| Debug mode | Set `debug=False` before deploying to production |

---

## ⚙️ How It Works

```
User Input (Browser)
       │
       ▼
POST /analyze  ←── Flask Route (app.py)
       │
       ▼
Build structured prompt
       │
       ▼
Google Gemini API  ←── Server-side only (API key stays here)
       │
       ▼
Parse AI response into: { disease, cause, treatment, prevention }
       │
       ▼
Return JSON to frontend
       │
       ▼
Render result modal with bullet-point formatting
```

### Gemini Prompt Structure

```
A farmer describes crop symptoms: {user_input}

Respond strictly in this format:
Disease: [name of the disease or condition]
Cause: [cause — fungal, bacterial, viral, pest, nutrient deficiency, etc.]
Treatment: [specific treatment steps]
Prevention: [preventive measures]
```

---

## 🌐 Deployment

### Render (Recommended — Free)

1. Add `gunicorn==21.2.0` to `requirements.txt`
2. Create a `Procfile` in the root:
   ```
   web: gunicorn app:app
   ```
3. Push to GitHub
4. Go to [render.com](https://render.com) → New Web Service → Connect repo
5. Set environment variable: `GEMINI_API_KEY` = your key
6. Deploy — you get a free `yourapp.onrender.com` URL ✅

### Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Add `GEMINI_API_KEY` in the Variables tab
3. Railway auto-detects Flask — done

### PythonAnywhere

1. Sign up at [pythonanywhere.com](https://pythonanywhere.com)
2. Upload files, set up a Flask Web App pointing to `app.py`
3. Add `GEMINI_API_KEY` to environment variables

### Environment Variables (All Platforms)

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key (required) |

> ⚠️ **Never** paste your API key directly into the code. Always use environment variables.

---

## 📋 API Reference

### `POST /analyze`

Accepts crop symptom text and returns a structured AI diagnosis.

**Request**
```json
{
  "symptoms": "My wheat crop has yellow-brown patches on the leaves..."
}
```

**Response (success)**
```json
{
  "success": true,
  "data": {
    "disease": "Wheat Leaf Rust (Puccinia triticina)",
    "cause": "Fungal infection caused by Puccinia triticina, spread by wind-borne spores in humid conditions.",
    "treatment": "Apply propiconazole or tebuconazole fungicide. Remove and destroy severely infected leaves. Ensure proper field drainage.",
    "prevention": "Use rust-resistant wheat varieties. Apply preventive fungicide at early growth stages. Avoid overhead irrigation."
  }
}
```

**Response (error)**
```json
{
  "success": false,
  "error": "Please describe the crop symptoms."
}
```

**Validation rules:**
- `symptoms` must be present (non-empty)
- Minimum length: 10 characters
- Maximum length: 2000 characters

---

## 🎨 UI/UX Highlights

- **Typography:** Playfair Display (serif, headings) + Lato (sans-serif, body)
- **Color Palette:** Deep forest green `#1f4d3a` · Warm ivory `#faf7f2` · Amber accents
- **Animations:** Staggered fade-up entrance · Spinner during analysis · Slide-up modal · Toast slide-in
- **Accessibility:** Semantic HTML, ARIA roles/labels, `aria-live` regions for alerts, keyboard navigation
- **Error States:** Red bordered alert for validation errors, yellow alert for soft warnings

---

## 🛠️ Development Notes

### Running in debug mode (local only)

```bash
# In app.py, debug=True is set for local development
python app.py
```

### Changing the Gemini model

In `app.py`, the model is set to `gemini-1.5-flash`. You can change it:

```python
model = genai.GenerativeModel("gemini-1.5-pro")   # More powerful, slower
model = genai.GenerativeModel("gemini-1.5-flash")  # Faster, default
```

### Adding more languages

The Gemini prompt can be modified to respond in regional languages:

```python
prompt = f"""... Respond in Hindi language. ..."""
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⚠️ Disclaimer

Krishi AI is intended for **educational and informational purposes only**. Always consult a certified agronomist, plant pathologist, or local agricultural extension officer before taking any major farming decision.

---

## 👨‍💻 Author

Sapun Jyoti Gogoi
