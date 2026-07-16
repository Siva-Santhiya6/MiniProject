const express = require("express");
const router = express.Router();
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  calculateOnly,
} = require("../controllers/recordController");

router.post("/calculate", calculateOnly); // quick calculate, no DB save

router.route("/").post(createRecord).get(getRecords);

router.route("/:id").get(getRecordById).put(updateRecord).delete(deleteRecord);

module.exports = router;
