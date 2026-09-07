import assignmentService from "../services/assignment.service.js";

const createAssignment = async (req, res) => {
  try {
    const { applicationId, mentorId } = req.body;

    if (!applicationId || !mentorId) {
      return res.status(400).json({
        success: false,
        message: "applicationId and mentorId are required",
      });
    }

    const assignment =
      await assignmentService.createAssignment({
        applicationId,
        mentorId,
        assignedBy: req.user.userId,
      });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    const knownErrors = [
      "Application not found",
      "Only approved applications can be assigned",
      "Application already assigned",
      "Mentor not found",
      "Selected user is not a mentor",
      "Assigner not found",
      "Only admin or HR can create assignments",
    ];

    const statusCode = knownErrors.includes(error.message)
      ? 400
      : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const assignments =
      await assignmentService.getAllAssignments();

    return res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyAssignments = async (req, res) => {
  try {
    const assignments =
      await assignmentService.getMyAssignments(
        req.user.userId
      );

    return res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudentAssignment = async (req, res) => {
  try {
    const assignments =
      await assignmentService.getStudentAssignment(
        req.user.userId
      );

    return res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAssignmentById = async (req, res) => {
  try {
    const assignment =
      await assignmentService.getAssignmentById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    return res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createAssignment,
  getAllAssignments,
  getMyAssignments,
  getStudentAssignment,
  getAssignmentById,
};
