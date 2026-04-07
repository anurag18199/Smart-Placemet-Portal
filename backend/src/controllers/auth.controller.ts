import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";
import { generateToken } from "../utils/generateToken";
import prisma from "../lib/prisma";


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // 1️⃣ Check email exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Transaction
    const result = await prisma.$transaction(async (tx) => {

      // Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role
        }
      });

      // If STUDENT → create Student profile
      if (role === Role.STUDENT) {
        await tx.student.create({
          data: {
            userId: user.id,
            rollNumber: "",
            branch: "",
            cgpa: 0,
            graduationYear: 0,
            phone: ""
          }
        });
      }

      // If COMPANY → create Company profile
      if (role === Role.COMPANY) {
        await tx.company.create({
          data: {
            userId: user.id,
            companyName: "",
            description: "",
            location: "",
            industry: "",
            phone: "",
            approved: false
          }
        });
      }

      return user;
    });

    const token = generateToken(result.id);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Generate JWT
    const token = generateToken(user.id);

    // 4️⃣ Return token AND user (role needed for frontend redirect)
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        student: true,
        company: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};