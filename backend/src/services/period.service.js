import prisma from "../config/prisma.js";

const getAllPeriods = async () => {
  return prisma.period.findMany({
    orderBy: {
      startDate: "desc",
    },
  });
};

const getPeriodById = async (id) => {
  const period = await prisma.period.findUnique({
    where: { id },
  });

  if (!period) {
    throw new Error("Period not found");
  }

  return period;
};

const createPeriod = async ({ code, startDate, endDate, status }) => {
  const existingPeriod = await prisma.period.findUnique({
    where: { code },
  });

  if (existingPeriod) {
    throw new Error("Period code already exists");
  }

  if (new Date(endDate) < new Date(startDate)) {
    throw new Error("End date must be after start date");
  }

  return prisma.period.create({
    data: {
      code,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: status || "DRAFT",
    },
  });
};

const updatePeriod = async (
  id,
  { code, startDate, endDate, status }
) => {
  const period = await prisma.period.findUnique({
    where: { id },
  });

  if (!period) {
    throw new Error("Period not found");
  }

  if (startDate && endDate) {
    if (new Date(endDate) < new Date(startDate)) {
      throw new Error("End date must be after start date");
    }
  }

  return prisma.period.update({
    where: { id },
    data: {
      ...(code !== undefined && { code }),
      ...(startDate !== undefined && {
        startDate: new Date(startDate),
      }),
      ...(endDate !== undefined && {
        endDate: new Date(endDate),
      }),
      ...(status !== undefined && { status }),
    },
  });
};

const deletePeriod = async (id) => {
  const period = await prisma.period.findUnique({
    where: { id },
  });

  if (!period) {
    throw new Error("Period not found");
  }

  return prisma.period.delete({
    where: { id },
  });
};

export {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
};
