import { Request, Response } from "express";
import { prisma } from '../utils/prismaClient';
import { checkPassword } from "../utils/passwordCompare";
import jwt from "jsonwebtoken";
import auth from "../config/auth";


class SessionsController {
  async createSession(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const user = await prisma.user.findFirst({ 
      where: { email },
    });

    if (!user) return res.status(404).json('User not found.');

    if (password && !(await checkPassword(password, user.passwordHash))) return res.status(401).json("Invalid Password");

    const { id, name } = user;

    return res.status(200).json({
      user: {
        id, name, email
      }, 
      token: jwt.sign({ id }, auth.secret as string, {
        expiresIn: auth.expires,
      })
    })
  }
}

export default new SessionsController();