from flask import Flask, render_template, request, jsonify
import os
import PyPDF2
import docx
import json

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ---------- Load categorized skills ----------
with open("skills.json") as f:
    SKILLS_CATEGORIES = json.load(f)

# Flatten skills for extraction
FLAT_SKILLS = [skill.lower() for skills in SKILLS_CATEGORIES.values() for skill in skills]

# ---------- Resume Extraction ----------
def extract_text_from_pdf(filepath):
    text = ""
    with open(filepath, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
    return text.lower()

def extract_text_from_docx(filepath):
    doc = docx.Document(filepath)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text.lower()

# ---------- Skill Extraction ----------
def extract_skills(text, manual_input=""):
    found_skills = set()
    
    # From manual input
    if manual_input:
        manual_list = [s.strip().lower() for s in manual_input.split(",") if s.strip()]
        found_skills.update(manual_list)
    
    # From resume text
    for skill in FLAT_SKILLS:
        if skill in text:
            found_skills.add(skill)
    
    return list(found_skills)

# ---------- Allowed file types ----------
ALLOWED_EXTENSIONS = {"pdf", "docx"}
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------- Routes ----------
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        manual_skills = request.form.get("manual_skills", "")
        resume_text = ""

        uploaded_file = request.files.get("resume_file")
        if uploaded_file and uploaded_file.filename != "":
            if allowed_file(uploaded_file.filename):
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
                uploaded_file.save(filepath)

                # Extract text
                if filepath.endswith(".pdf"):
                    resume_text = extract_text_from_pdf(filepath)
                elif filepath.endswith(".docx"):
                    resume_text = extract_text_from_docx(filepath)
            else:
                return "Unsupported file type. Please upload PDF or DOCX.", 400

        detected_skills = extract_skills(resume_text, manual_skills)
        return jsonify({"skills": detected_skills})

    return render_template("skills.html")

# Route to get categories for dropdown
@app.route("/get_categories")
def get_categories():
    return jsonify(SKILLS_CATEGORIES)

if __name__ == "__main__":
    app.run(debug=True)
