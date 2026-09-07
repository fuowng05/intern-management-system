import companyService from "../services/company.service.js";

const getAllCompanies = async (req, res) => {
  try {
    const companies = await companyService.getAllCompanies();

    return res.json({
      success: true,
      data: companies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await companyService.getCompanyById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.json({
      success: true,
      data: company,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createCompany = async (req, res) => {
  try {
    const { name, field } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const company = await companyService.createCompany({
      name,
      field,
    });

    return res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: company,
    });
  } catch (error) {
    const status = error.message === "Company already exists" ? 409 : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const company = await companyService.updateCompany(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (error) {
    const status = error.message === "Company not found" ? 404 : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    await companyService.deleteCompany(req.params.id);

    return res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    const status = error.message === "Company not found" ? 404 : 500;

    return res.status(status).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
