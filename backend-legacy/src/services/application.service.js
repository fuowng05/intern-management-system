import prisma from "../config/prisma.js";
import notificationService from "./notification.service.js";

const createApplication = async ({
  studentId,
  periodId,
  companyId,
}) => {
  const student = await prisma.user.findUnique({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  if (student.role !== "student") {
    throw new Error("Only students can submit applications");
  }

  const period = await prisma.period.findUnique({
    where: {
      id: periodId,
    },
  });

  if (!period) {
    throw new Error("Period not found");
  }

  if (period.status !== "OPEN") {
    throw new Error("Period is not open");
  }

  const company = await prisma.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company) {
    throw new Error("Company not found");
  }

  const existingApplication =
    await prisma.application.findUnique({
      where: {
        studentId_periodId: {
          studentId,
          periodId,
        },
      },
    });

  if (existingApplication) {
    throw new Error(
      "You have already submitted an application for this period"
    );
  }

  return prisma.application.create({
    data: {
      studentId,
      periodId,
      companyId,
      status: "PENDING",
    },
    include: {
      company: true,
      period: true,
    },
  });
};

const getMyApplications = async (studentId) => {
  return prisma.application.findMany({
    where: {
      studentId,
    },
    include: {
      company: true,
      period: true,
      assignment: true,
      evaluation: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAllApplications = async () => {
  return prisma.application.findMany({
    include: {
      student: {
        select: {
          id: true,
          email: true,
          role: true,
          studentProfile: true,
        },
      },
      company: true,
      period: true,
      assignment: true,
      evaluation: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getApplicationById = async (id) => {
  return prisma.application.findUnique({
    where: {
      id,
    },
    include: {
      student: {
        select: {
          id: true,
          email: true,
          role: true,
          studentProfile: true,
        },
      },
      company: true,
      period: true,
      assignment: true,
      evaluationCriteria: true,
      evaluation: true,
    },
  });
};

/*
 * Update application status
 * + Create notification for student
 */
const updateApplicationStatus = async (id, status) => {
  const application =
    await prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        company: true,
        period: true,
      },
    });

  if (!application) {
    throw new Error("Application not found");
  }

  if (!["APPROVED", "REJECTED"].includes(status)) {
    throw new Error("Invalid application status");
  }

  const updatedApplication =
    await prisma.application.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        company: true,
        period: true,
      },
    });

  /*
   * Create notification for student
   */
  const title =
    status === "APPROVED"
      ? "Application Approved"
      : "Application Rejected";

  const message =
    status === "APPROVED"
      ? `Your internship application at ${application.company.name} has been approved.`
      : `Your internship application at ${application.company.name} has been rejected.`;

  await notificationService.createNotification({
    userId: application.studentId,
    title,
    message,
  });

  return updatedApplication;
};

export default {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};