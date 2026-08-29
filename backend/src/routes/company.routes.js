import express from "express";
import companyController from "../controllers/company.controller.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("admin", "hr", "student", "mentor"),
  companyController.getAllCompanies
);

router.get(
  "/:id",
  authenticate,
  authorize("admin", "hr", "student", "mentor"),
  companyController.getCompanyById
);

router.post(
  "/",
  authenticate,
  authorize("admin", "hr"),
  companyController.createCompany
);

router.put(
  "/:id",
  authenticate,
  authorize("admin", "hr"),
  companyController.updateCompany
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  companyController.deleteCompany
);

export default router;
