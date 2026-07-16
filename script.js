const API_BASE = "http://localhost:5000/api/records";

const form = document.getElementById("recordForm");
const subjectsList = document.getElementById("subjectsList");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const resetBtn = document.getElementById("resetBtn");
const statusMsg = document.getElementById("statusMsg");
const recordsList = document.getElementById("recordsList");
const recordIdField = document.getElementById("recordId");
const submitBtn = document.getElementById("submitBtn");

// ---------- Subject rows ----------
function addSubjectRow(name = "", credit = "", gradePoint = "") {
  const row = document.createElement("div");
  row.className = "subject-row";
  row.innerHTML = `
    <input type="text" class="subject-name" placeholder="Subject name" value="${name}" required />
    <input type="number" class="subject-credit" placeholder="Credit" min="0" step="1" value="${credit}" required />
    <input type="number" class="subject-grade" placeholder="Grade point (0-10)" min="0" max="10" step="0.1" value="${gradePoint}" required />
    <button type="button" class="remove-subject">✕</button>
  `;
  row.querySelector(".remove-subject").addEventListener("click", () => row.remove());
  subjectsList.appendChild(row);
}

addSubjectBtn.addEventListener("click", () => addSubjectRow());

function getSubjectsFromForm() {
  const rows = subjectsList.querySelectorAll(".subject-row");
  return Array.from(rows).map((row) => ({
    subjectName: row.querySelector(".subject-name").value.trim(),
    credit: Number(row.querySelector(".subject-credit").value),
    gradePoint: Number(row.querySelector(".subject-grade").value),
  }));
}

function showStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = type;
  setTimeout(() => {
    statusMsg.textContent = "";
    statusMsg.className = "";
  }, 3500);
}

function resetForm() {
  form.reset();
  recordIdField.value = "";
  subjectsList.innerHTML = "";
  addSubjectRow();
  submitBtn.textContent = "Save Record";
}

resetBtn.addEventListener("click", resetForm);

// ---------- CREATE / UPDATE ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    studentName: document.getElementById("studentName").value.trim(),
    registerNumber: document.getElementById("registerNumber").value.trim(),
    semester: document.getElementById("semester").value.trim(),
    subjects: getSubjectsFromForm(),
  };

  if (payload.subjects.length === 0) {
    showStatus("Add at least one subject", "error");
    return;
  }

  const id = recordIdField.value;
  const url = id ? `${API_BASE}/${id}` : API_BASE;
  const method = id ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Request failed");
    }

    showStatus(id ? "Record updated successfully" : "Record created successfully", "success");
    resetForm();
    loadRecords();
  } catch (err) {
    showStatus(err.message, "error");
  }
});

// ---------- READ ----------
async function loadRecords() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();

    if (!data.success) throw new Error("Failed to load records");

    recordsList.innerHTML = "";
    if (data.data.length === 0) {
      recordsList.innerHTML = "<p>No records yet.</p>";
      return;
    }

    data.data.forEach((record) => {
      const card = document.createElement("div");
      card.className = "record-card";
      card.innerHTML = `
        <div class="record-top">
          <h4>${record.studentName} — ${record.semester}</h4>
          <span class="cgpa-badge">CGPA: ${record.cgpa}</span>
        </div>
        <p>Register No: ${record.registerNumber || "-"}</p>
        <ul>
          ${record.subjects
            .map(
              (s) =>
                `<li>${s.subjectName}: ${s.credit} credits, grade point ${s.gradePoint}</li>`
            )
            .join("")}
        </ul>
        <div class="record-actions">
          <button class="edit-btn" data-id="${record._id}">Edit</button>
          <button class="delete-btn" data-id="${record._id}">Delete</button>
        </div>
      `;
      recordsList.appendChild(card);
    });

    document.querySelectorAll(".edit-btn").forEach((btn) =>
      btn.addEventListener("click", () => editRecord(btn.dataset.id))
    );
    document.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => deleteRecord(btn.dataset.id))
    );
  } catch (err) {
    showStatus(err.message, "error");
  }
}

// ---------- UPDATE (populate form) ----------
async function editRecord(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error("Record not found");

    const record = data.data;
    recordIdField.value = record._id;
    document.getElementById("studentName").value = record.studentName;
    document.getElementById("registerNumber").value = record.registerNumber || "";
    document.getElementById("semester").value = record.semester;

    subjectsList.innerHTML = "";
    record.subjects.forEach((s) => addSubjectRow(s.subjectName, s.credit, s.gradePoint));

    submitBtn.textContent = "Update Record";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    showStatus(err.message, "error");
  }
}

// ---------- DELETE ----------
async function deleteRecord(id) {
  if (!confirm("Delete this record?")) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Delete failed");
    showStatus("Record deleted", "success");
    loadRecords();
  } catch (err) {
    showStatus(err.message, "error");
  }
}

// ---------- Init ----------
addSubjectRow();
loadRecords();
