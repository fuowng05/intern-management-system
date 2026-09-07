import prisma from "../config/prisma.js";
import notificationService from "./notification.service.js";

const createAssignment = async ({
  applicationId,
  mentorId,
  assignedBy,
}) => {
  // 1. Check application
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      student: {
        select: {
          id: true,
          email: true,
        },
      },
      company: true,
      period: true,
      assignment: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  // 2. Application must be approved
  if (application.status !== "APPROVED") {
    throw new Error(
      "Only approved applications can be assigned"
    );
  }

  // 3. Check existing assignment
  if (application.assignment) {
    throw new Error("Application already assigned");
  }

  // 4. Check mentor
  const mentor = await prisma.user.findUnique({
    where: {
      id: mentorId,
    },
  });

  if (!mentor) {
    throw new Error("Mentor not found");
  }

  if (mentor.role !== "mentor") {
    throw new Error("Selected user is not a mentor");
  }

  // 5. Check assigner
  const assigner = await prisma.user.findUnique({
    where: {
      id: assignedBy,
    },
  });

  if (!assigner) {
    throw new Error("Assigner not found");
  }

  if (!["admin", "hr"].includes(assigner.role)) {
    throw new Error(
      "Only admin or HR can create assignments"
    );
  }

  // 6. Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      applicationId,
      mentorId,
      assignedBy,
    },
    include: {
      application: {
        include: {
          student: {
            select: {
              id: true,
              email: true,
            },
          },
          company: true,
          period: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      assigner: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  // 7. Notify mentor
  await notificationService.createNotification({
    userId: mentorId,
    title: "New Internship Assignment",
    message: `You have been assigned to supervise an intern at ${application.company.name}.`,
  });

  return assignment;
};

const getAllAssignments = async () => {
  return prisma.assignment.findMany({
    include: {
      application: {
        include: {
          student: {
            select: {
              id: true,
              email: true,
            },
          },
          company: true,
          period: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      assigner: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getMyAssignments = async (mentorId) => {
  return prisma.assignment.findMany({
    where: {
      mentorId,
    },
    include: {
      application: {
        include: {
          student: {
            select: {
              id: true,
              email: true,
            },
          },
          company: true,
          period: true,
          evaluation: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      assigner: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getStudentAssignment = async (studentId) => {
  return prisma.assignment.findFirst({
    where: {
      application: {
        studentId,
      },
    },
    include: {
      application: {
        include: {
          student: {
            select: {
              id: true,
              email: true,
            },
          },
          company: true,
          period: true,
          evaluation: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      assigner: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAssignmentById = async (id) => {
  return prisma.assignment.findUnique({
    where: {
      id,
    },
    include: {
      application: {
        include: {
          student: {
            select: {
              id: true,
              email: true,
            },
          },
          company: true,
          period: true,
          evaluation: true,
        },
      },
      mentor: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
      assigner: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export default {
  createAssignment,
  getAllAssignments,
  getMyAssignments,
  getStudentAssignment,
  getAssignmentById,
};
