const express = require("express");

const {
  addAssignment,
  teacherAssignments,
  deleteAssignment,
  retriveAssignments,
  updateAssignment,
} = require("../controllers/assignmentController");
const { authenticateJWT } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/assignments", authenticateJWT, addAssignment);
router.get(
  "/teacher-assignments/:teacherId",
  authenticateJWT,
  teacherAssignments
);
router.delete(
  "/delete-assignment/:assignmentId",
  authenticateJWT,
  deleteAssignment
);
router.get("/assignments", retriveAssignments);
router.put(
  "/update-assignment/:assignmentId",
  authenticateJWT,
  updateAssignment
);
// Add routes for fetching, updating, and deleting assignments

module.exports = router;
