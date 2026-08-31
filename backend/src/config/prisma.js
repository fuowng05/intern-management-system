import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import mariadb from 'mariadb';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const mariadbAdapterModule = require('@prisma/adapter-mariadb');

// Tự động trích xuất Constructor Class từ module
const PrismaMariadbClass = 
  mariadbAdapterModule.PrismaMariadb || 
  mariadbAdapterModule.PrismaMariaDb || 
  mariadbAdapterModule.PrismaMariaDB || 
  Object.values(mariadbAdapterModule).find(item => typeof item === 'function');

if (!PrismaMariadbClass) {
  throw new Error("Không tìm thấy Adapter Class hợp lệ trong @prisma/adapter-mariadb");
}

// Parse thông tin kết nối CSDL từ DATABASE_URL
const rawUrl = process.env.DATABASE_URL || "mysql://root@localhost:3306/intern_db";
const formattedUrl = rawUrl.replace(/^(mysql|mariadb):\/\//, 'http://');
const parsedUrl = new URL(formattedUrl);

// Tạo connection pool
const pool = mariadb.createPool({
  host: parsedUrl.hostname || 'localhost',
  port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
  user: parsedUrl.username || 'root',
  password: parsedUrl.password || '',
  database: parsedUrl.pathname.replace('/', '') || 'intern_db',
});

const adapter = new PrismaMariadbClass(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;