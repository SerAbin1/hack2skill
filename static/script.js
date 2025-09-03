// Elements
const form = document.getElementById("skillsForm");
const fileInput = document.getElementById("resumeFile");
const fileUploadButton = document.getElementById("fileUploadButton");
const fileName = document.getElementById("fileName");

const categorySelect = document.getElementById("categorySelect");
const skillsContainer = document.getElementById("skillsContainer");

const manualInput = document.getElementById("manualSkills");
const suggestionsDiv = document.getElementById("suggestions");

const selectedCount = document.getElementById("selectedCount");
const submitBtn = document.getElementById("submitBtn");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");
const resultsSection = document.getElementById("resultsSection");
const skillsList = document.getElementById("skillsList");

const allowedExtensions = ["pdf", "docx"];
let SKILLS_CATEGORIES = {};
let selectedSkills = new Set(); // persists across category changes

// ---------- Load skills.json & populate dropdown ----------
fetch("/skills.json")
  .then(res => res.json())
  .then(data => {
    SKILLS_CATEGORIES = data;
    populateCategoryDropdown(Object.keys(SKILLS_CATEGORIES));
  })
  .catch(err => {
    console.error("Failed to load skills.json", err);
    skillsContainer.innerHTML = `<div class="placeholder">Could not load skills.</div>`;
  });

function populateCategoryDropdown(categories){
  categorySelect.innerHTML = `<option value="">-- Select Category --</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

// ---------- Render skills for the chosen category ----------
categorySelect.addEventListener("change", () => {
  const cat = categorySelect.value;
  if(!cat){
    skillsContainer.innerHTML = `<div class="placeholder">Choose a category to see skills</div>`;
    return;
  }
  renderCategorySkills(cat);
  updateSelectedCount();
});

function renderCategorySkills(category){
  const skills = SKILLS_CATEGORIES[category] || [];
  skillsContainer.innerHTML = "";

  if(skills.length === 0){
    skillsContainer.innerHTML = `<div class="placeholder">No skills in this category.</div>`;
    return;
  }

  skills.forEach(skill => {
    const row = document.createElement("label");
    row.className = "skill-checkbox";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = skill;
    cb.checked = selectedSkills.has(skill);

    cb.addEventListener("change", (e) => {
      if(e.target.checked) selectedSkills.add(skill);
      else selectedSkills.delete(skill);
      updateSelectedCount();
    });

    const txt = document.createElement("span");
    txt.textContent = skill;

    row.appendChild(cb);
    row.appendChild(txt);
    skillsContainer.appendChild(row);
  });
}

// ---------- Selected count ----------
function updateSelectedCount(){
  const count = selectedSkills.size;
  selectedCount.textContent = `${count} skill${count !== 1 ? "s" : ""} selected`;
}

// ---------- File upload UI ----------
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if(file){
    fileName.textContent = `Selected: ${file.name}`;
    fileUploadButton.textContent = file.name;
  }else{
    fileName.textContent = "";
    fileUploadButton.textContent = "Choose File";
  }
});

// ---------- Manual input with suggestions ----------
let suggestionTimer;
manualInput.addEventListener("input", () => {
  clearTimeout(suggestionTimer);
  suggestionTimer = setTimeout(showSuggestions, 120);
});

function showSuggestions(){
  const q = manualInput.value.trim().toLowerCase();
  suggestionsDiv.innerHTML = "";
  if(!q) return;

  // Gather all skills (unique)
  const all = Array.from(new Set([].concat(...Object.values(SKILLS_CATEGORIES))));
  const matches = all
    .filter(s => s.toLowerCase().startsWith(q) && !selectedSkills.has(s))
    .slice(0, 7);

  matches.forEach(s => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.textContent = s;
    item.addEventListener("click", () => {
      selectedSkills.add(s);
      updateSelectedCount();
      // If the current category contains it, tick it
      const curCat = categorySelect.value;
      if(curCat && SKILLS_CATEGORIES[curCat]?.includes(s)){
        const box = [...skillsContainer.querySelectorAll('input[type="checkbox"]')].find(i => i.value === s);
        if(box){ box.checked = true; }
      }
      manualInput.value = "";
      suggestionsDiv.innerHTML = "";
    });
    suggestionsDiv.appendChild(item);
  });
}

// Hide suggestions when clicking elsewhere
document.addEventListener("click", (e) => {
  if(!manualInput.contains(e.target) && !suggestionsDiv.contains(e.target)){
    suggestionsDiv.innerHTML = "";
  }
});

// ---------- Submit ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessages();

  // Validate file type if provided
  const file = fileInput.files[0];
  if(file){
    const ext = file.name.split(".").pop().toLowerCase();
    if(!allowedExtensions.includes(ext)){
      showError("Unsupported file type! Please upload PDF or DOCX.");
      return;
    }
  }

  // Parse manual comma-separated list
  const manualSkillsList = manualInput.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // Combine (Set keeps unique)
  const combined = new Set([...selectedSkills, ...manualSkillsList]);

  if(!file && combined.size === 0){
    showError("Please select skills, enter manual skills, or upload a resume.");
    return;
  }

  // Prepare FormData
  const fd = new FormData();
  if(file) fd.append("resume_file", file);
  fd.append("manual_skills", Array.from(combined).join(","));

  // Loading
  submitBtn.style.display = "none";
  loading.style.display = "block";

  try{
    const res = await fetch("/", { method:"POST", body: fd });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    displayResults(data.skills || []);
    showSuccess("Skills processed successfully!");
  }catch(err){
    console.error(err);
    showError("An error occurred while processing your request. Please try again.");
  }finally{
    submitBtn.style.display = "block";
    loading.style.display = "none";
  }
});

// ---------- Results ----------
function displayResults(skills){
  skillsList.innerHTML = "";
  skills.forEach((s, i) => {
    const li = document.createElement("li");
    li.className = "skill-tag";
    li.textContent = s;
    li.style.animationDelay = `${i * 0.06}s`;
    skillsList.appendChild(li);
  });
  resultsSection.style.display = "block";
  resultsSection.scrollIntoView({ behavior: "smooth" });
}

// ---------- Messages ----------
function showError(msg){
  errorMessage.textContent = msg;
  errorMessage.style.display = "block";
  successMessage.style.display = "none";
}
function showSuccess(msg){
  successMessage.textContent = msg;
  successMessage.style.display = "block";
  errorMessage.style.display = "none";
}
function hideMessages(){
  errorMessage.style.display = "none";
  successMessage.style.display = "none";
}
