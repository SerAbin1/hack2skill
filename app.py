from flask import Flask, render_template, request
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # Max 5 MB upload

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Handle manual skills input
        manual_skills = request.form.get("manual_skills")
        print("Manual Skills:", manual_skills)

        # Handle file upload
        uploaded_file = request.files.get("resume_file")
        if uploaded_file and uploaded_file.filename != "":
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], uploaded_file.filename)
            uploaded_file.save(filepath)
            print("Uploaded file saved to:", filepath)

        return "Data received! Check console output."
    return render_template("skills.html")

if __name__ == "__main__":
    app.run(debug=True)
