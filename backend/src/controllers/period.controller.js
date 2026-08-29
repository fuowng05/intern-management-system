import * as periodService from "../services/period.service.js";

const getAll = async (req, res) => {
  try {
    const periods = await periodService.getAllPeriods();

    res.json({
      success: true,
      data: periods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const period = await periodService.getPeriodById(req.params.id);

    res.json({
      success: true,
      data: period,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const create = async (req, res) => {
  try {
    const { code, startDate, endDate, status } = req.body;

    if (!code || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "code, startDate and endDate are required",
      });
    }

    const period = await periodService.createPeriod({
      code,
      startDate,
      endDate,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Period created successfully",
      data: period,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const period = await periodService.updatePeriod(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Period updated successfully",
      data: period,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await periodService.deletePeriod(req.params.id);

    res.json({
      success: true,
      message: "Period deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  getAll,
  getById,
  create,
  update,
  remove,
};
