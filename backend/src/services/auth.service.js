import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

const SALT_ROUNDS = 10;

const register = async ({ email, password, role }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
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

const login = async (credentials, optionalPassword) => {
  // Tự động nhận diện dù controller truyền login({ email, password }) hay login(email, password)
  let email, password;
  if (typeof credentials === "object" && credentials !== null) {
    email = credentials.email;
    password = credentials.password;
  } else {
    email = credentials;
    password = optionalPassword;
  }

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Tự động tương thích với cả passwordHash lẫn password_hash trong CSDL
  const storedPassword = user.passwordHash || user.password_hash || user.password;
  const passwordMatched = await bcrypt.compare(password, storedPassword);

  if (!passwordMatched) {
    throw new Error("Invalid email or password");
  }

  // Chuỗi khóa dự phòng tránh crash nếu chưa cấu hình file .env
  const secretKey = process.env.JWT_SECRET || "fallback_jwt_secret_key_123";

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    secretKey,
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