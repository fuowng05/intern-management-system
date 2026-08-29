import applicationService from "../services/application.service.js";

const createApplication = async (req, res) => {
  try {
    const { periodId, companyId } = req.body;

    if (!periodId || !companyId) {
      return res.status(400).json({
        success: false,
        message: "periodId and companyId are required",
      });
    }

    const application =
      await applicationService.createApplication({
        studentId: req.user.userId,
        periodId,
        companyId,
      });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    const knownErrors = [
      "Student not found",
      "Only students can submit applications",
      "Period not found",
      "Period is not open",
      "Company not found",
    ];

    const status =
      error.message.includes("already submitted")
        ? 409
        : knownErrors.includes(error.message)
          ? 400
          : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications =
      await applicationService.getMyApplications(
        req.user.userId
      );

    return res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications =
      await applicationService.getAllApplications();

    return res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application =
      await applicationService.getApplicationById(
        req.params.id
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.json({
      success: true,
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application =
      await applicationService.updateApplicationStatus(
        req.params.id,
        status
      );

    return res.json({
      success: true,
      message: "Application status updated successfully",
      data: application,
    });
  } catch (error) {
    const statusCode =
      error.message === "Application not found"
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};
