const Record = require("../models/Record");

// CREATE - POST /api/records
exports.createRecord = async (req, res) => {
  try {
    const { studentName, registerNumber, semester, subjects } = req.body;
    const record = new Record({ studentName, registerNumber, semester, subjects });
    await record.save();
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// READ ALL - GET /api/records
exports.getRecords = async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ONE - GET /api/records/:id
exports.getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid ID or " + err.message });
  }
};

// UPDATE - PUT /api/records/:id
exports.updateRecord = async (req, res) => {
  try {
    const { studentName, registerNumber, semester, subjects } = req.body;

    const record = await Record.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }

    if (studentName !== undefined) record.studentName = studentName;
    if (registerNumber !== undefined) record.registerNumber = registerNumber;
    if (semester !== undefined) record.semester = semester;
    if (subjects !== undefined) record.subjects = subjects;

    await record.save(); // pre-save hook recalculates cgpa
    res.status(200).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE - DELETE /api/records/:id
exports.deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: "Record not found" });
    }
    res.status(200).json({ success: true, message: "Record deleted", data: record });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid ID or " + err.message });
  }
};

// UTILITY - POST /api/calculate (calculate CGPA without saving to DB)
exports.calculateOnly = (req, res) => {
  try {
    const { subjects } = req.body;
    if (!Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ success: false, message: "subjects array is required" });
    }
    const Record = require("../models/Record");
    const cgpa = Record.calculateCgpa(subjects);
    res.status(200).json({ success: true, cgpa });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
