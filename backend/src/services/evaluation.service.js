import prisma from "../config/prisma.js";

const createEvaluation = async ({
  applicationId,
  mentorId,
  criteria,
}) => {
  // 1. Kiểm tra application
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      assignment: true,
    },
  });

  if (!application) {
    throw new Error("Application not found");
  }

  // 2. Chỉ đánh giá application đã được approve
  if (application.status !== "APPROVED") {
    throw new Error("Application must be approved before evaluation");
  }

  // 3. Kiểm tra mentor được assign cho application này
  if (!application.assignment) {
    throw new Error("Application has not been assigned to a mentor");
  }

  if (application.assignment.mentorId !== mentorId) {
    throw new Error("You are not assigned to this application");
  }

  // 4. Không cho tạo evaluation lần 2
  const existingEvaluation = await prisma.evaluation.findUnique({
    where: {
      applicationId,
    },
  });

  if (existingEvaluation) {
    throw new Error("Evaluation already exists");
  }

  // 5. Validate criteria
  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("Evaluation criteria are required");
  }

  const totalWeight = criteria.reduce(
    (sum, item) => sum + Number(item.weight),
    0
  );

  if (totalWeight !== 100) {
    throw new Error("Total criteria weight must equal 100");
  }

  for (const item of criteria) {
    if (!item.name || item.weight === undefined) {
      throw new Error("Each criterion must have name and weight");
    }

    if (Number(item.weight) <= 0) {
      throw new Error("Criterion weight must be greater than 0");
    }
  }

  // 6. Transaction: tạo Evaluation + Criteria
  return prisma.$transaction(async (tx) => {
    const evaluation = await tx.evaluation.create({
      data: {
        applicationId,
        totalScore: 0,
        finalStatus: "IN_PROGRESS",
      },
    });

    await tx.evaluationCriteria.createMany({
      data: criteria.map((item) => ({
        applicationId,
        name: item.name,
        weight: item.weight,
        score: null,
      })),
    });

    return tx.evaluation.findUnique({
      where: {
        id: evaluation.id,
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
        application: true,
      },
    });
  });
};


const getEvaluationByApplicationId = async (
  applicationId
) => {
  return prisma.evaluation.findUnique({
    where: {
      applicationId,
    },
    include: {
      application: {
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
          assignment: {
            include: {
              mentor: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });
};


const getAllEvaluations = async () => {
  return prisma.evaluation.findMany({
    include: {
      application: {
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
          assignment: {
            include: {
              mentor: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


const updateCriteriaScore = async ({
  criteriaId,
  score,
  mentorId,
}) => {
  const criteria = await prisma.evaluationCriteria.findUnique({
    where: {
      id: criteriaId,
    },
    include: {
      application: {
        include: {
          assignment: true,
          evaluation: true,
        },
      },
    },
  });

  if (!criteria) {
    throw new Error("Evaluation criterion not found");
  }

  if (!criteria.application.assignment) {
    throw new Error("Application has not been assigned to a mentor");
  }

  if (criteria.application.assignment.mentorId !== mentorId) {
    throw new Error("You are not assigned to this application");
  }

  const numericScore = Number(score);

  if (
    Number.isNaN(numericScore) ||
    numericScore < 0 ||
    numericScore > 10
  ) {
    throw new Error("Score must be between 0 and 10");
  }

  const updatedCriteria =
    await prisma.evaluationCriteria.update({
      where: {
        id: criteriaId,
      },
      data: {
        score: numericScore,
      },
    });

  await recalculateEvaluation(criteria.applicationId);

  return updatedCriteria;
};


const recalculateEvaluation = async (applicationId) => {
  const evaluation = await prisma.evaluation.findUnique({
    where: {
      applicationId,
    },
  });

  if (!evaluation) {
    throw new Error("Evaluation not found");
  }

  const criteria =
    await prisma.evaluationCriteria.findMany({
      where: {
        applicationId,
      },
    });

  const allScored = criteria.every(
    (item) => item.score !== null
  );

  const totalScore = criteria.reduce(
    (sum, item) =>
      sum +
      (Number(item.score || 0) *
        Number(item.weight)) /
        100,
    0
  );

  let finalStatus = "IN_PROGRESS";

  if (allScored) {
    finalStatus =
      totalScore >= 5 ? "PASSED" : "FAILED";
  }

  return prisma.evaluation.update({
    where: {
      id: evaluation.id,
    },
    data: {
      totalScore: Number(totalScore.toFixed(2)),
      finalStatus,
    },
  });
};


const getStudentEvaluation = async (studentId) => {
  return prisma.evaluation.findFirst({
    where: {
      application: {
        studentId,
      },
    },
    include: {
      application: {
        include: {
          company: true,
          period: true,
          assignment: {
            include: {
              mentor: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
};


const getMentorEvaluations = async (mentorId) => {
  return prisma.evaluation.findMany({
    where: {
      application: {
        assignment: {
          mentorId,
        },
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
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export default {
  createEvaluation,
  getEvaluationByApplicationId,
  getAllEvaluations,
  updateCriteriaScore,
  getStudentEvaluation,
  getMentorEvaluations,
};