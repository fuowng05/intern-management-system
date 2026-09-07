import evaluationService from "../services/evaluation.service.js";

const createEvaluation = async (req, res) => {
  try {
    const {
      applicationId,
      criteria,
    } = req.body;

    if (!applicationId || !criteria) {
      return res.status(400).json({
        success: false,
        message: "applicationId and criteria are required",
      });
    }

    const evaluation =
      await evaluationService.createEvaluation({
        applicationId,
        mentorId: req.user.userId,
        criteria,
      });

    return res.status(201).json({
      success: true,
      message: "Evaluation created successfully",
      data: evaluation,
    });
  } catch (error) {
    const status =
      error.message.includes("already exists")
        ? 409
        : 400;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};


const getEvaluationByApplicationId = async (
  req,
  res
) => {
  try {
    const evaluation =
      await evaluationService.getEvaluationByApplicationId(
        req.params.applicationId
      );

    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: "Evaluation not found",
      });
    }

    return res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllEvaluations = async (req, res) => {
  try {
    const evaluations =
      await evaluationService.getAllEvaluations();

    return res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateCriteriaScore = async (req, res) => {
  try {
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "score is required",
      });
    }

    const criteria =
      await evaluationService.updateCriteriaScore({
        criteriaId: req.params.criteriaId,
        score,
        mentorId: req.user.userId,
      });

    return res.json({
      success: true,
      message: "Criteria score updated successfully",
      data: criteria,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const getStudentEvaluation = async (req, res) => {
  try {
    const evaluation =
      await evaluationService.getStudentEvaluation(
        req.user.userId
      );

    return res.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getMentorEvaluations = async (req, res) => {
  try {
    const evaluations =
      await evaluationService.getMentorEvaluations(
        req.user.userId
      );

    return res.json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export default {
  createEvaluation,
  getEvaluationByApplicationId,
  getAllEvaluations,
  updateCriteriaScore,
  getStudentEvaluation,
  getMentorEvaluations,
};