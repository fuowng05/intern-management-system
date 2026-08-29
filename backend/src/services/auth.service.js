import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const SALT_ROUNDS = 10;

const register = async ({ email, password, role }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      passwordHash,
      role: role || "student",
    },
    select: {
      id: true,
      email: true,
      role: true,
      companyId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatched = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatched) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
};

const getCurrentUser = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      companyId: true,
      createdAt: true,
      updatedAt: true,
      studentProfile: {
        select: {
          id: true,
          studentCode: true,
          major: true,
        },
      },
    },
  });
};

export default {
  register,
  login,
  getCurrentUser,
};