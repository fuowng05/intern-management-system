import prisma from "../config/prisma.js";

const getAllCompanies = async () => {
  return prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const getCompanyById = async (id) => {
  return prisma.company.findUnique({
    where: { id },
  });
};

const createCompany = async ({ name, field }) => {
  const normalizedName = name.trim();

  const existingCompany = await prisma.company.findUnique({
    where: {
      name: normalizedName,
    },
  });

  if (existingCompany) {
    throw new Error("Company already exists");
  }

  return prisma.company.create({
    data: {
      name: normalizedName,
      field: field?.trim() || null,
    },
  });
};

const updateCompany = async (id, { name, field }) => {
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return prisma.company.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(field !== undefined && {
        field: field?.trim() || null,
      }),
    },
  });
};

const deleteCompany = async (id) => {
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  return prisma.company.delete({
    where: { id },
  });
};

export default {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
