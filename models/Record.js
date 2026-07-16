const mongoose = require("mongoose");

// A single subject entry: credit hours and the grade point earned (0-10 scale)
const subjectSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true, trim: true },
    credit: { type: Number, required: true, min: 0 },
    gradePoint: { type: Number, required: true, min: 0, max: 10 },
  },
  { _id: false }
);

const recordSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    registerNumber: { type: String, trim: true },
    semester: { type: String, required: true, trim: true },
    subjects: {
      type: [subjectSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one subject is required",
      },
    },
    cgpa: { type: Number }, // auto-calculated, not client-supplied
  },
  { timestamps: true }
);

// Calculate CGPA = sum(credit * gradePoint) / sum(credit)
recordSchema.pre("save", function (next) {
  const totalCredits = this.subjects.reduce((sum, s) => sum + s.credit, 0);
  const totalPoints = this.subjects.reduce((sum, s) => sum + s.credit * s.gradePoint, 0);
  this.cgpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
  next();
});

// Also recalc on findOneAndUpdate (used by PUT route)
recordSchema.statics.calculateCgpa = function (subjects) {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credit, 0);
  const totalPoints = subjects.reduce((sum, s) => sum + s.credit * s.gradePoint, 0);
  return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0;
};

module.exports = mongoose.model("Record", recordSchema);
