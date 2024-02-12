import { prisma } from '../utils/prismaClient';
import { Request, Response } from "express";
import * as z from 'zod';
import bcrypt from 'bcryptjs';
import { checkPassword } from "../utils/passwordCompare";

import { sendWelcomeEmail } from '../emails/mailer';

class UsersController {
  
  async index(_req: Request, res: Response): Promise<Response> {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true,  passwordHash: false, createdAt: true, updatedAt: true, fotos: {
        select: { id: true}
      } },
    });
    
    return res.status(200).json(users);
  }
  
  async show(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    
    const schema = z.object({
      email: z.string().email().min(11),
      password: z.string().min(8),
    })
    
    const validationResult = schema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json(validationResult.error.message);
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })
    
    if (password && !(await checkPassword(password, user?.passwordHash || ''))) return res.status(400).json('Email or password is incorrect.')

    if (!user) {
      return res.status(400).json('User not found');
    }

    const {id, name, createdAt, updatedAt} = user;
    
    return res.status(200).json({ id,  name, email, createdAt, updatedAt });
  }
  
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password, passwordConfirmation } = req.body;
    
    try {
      const schema = z.object({
        name: z.string().min(4),
        email: z.string().email().min(11),
        password: z.string().min(8),
        passwordConfirmation: z.string().refine(() => password === passwordConfirmation, {
          message: "Passwords do not match",
          path: ["passwordConfirmation"],
        })
      });
      
      const validationResult = schema.safeParse(req.body);
      
      if (!validationResult.success) return res.status(400).json(validationResult.error.message);
      
      if (password !== passwordConfirmation) return  res.status(400).json('Password and Password Confirmation do not match.');

      if (password !== passwordConfirmation) return res.status(401).json('Password and passord confirmation do not match');
      
      const passwordHash = await bcrypt.hash(password, 8);

      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          passwordHash: passwordHash
        }
      });

      if (!user) return res.status(404).json("User not Found");

      const { id, createdAt, updatedAt } = user;

      sendWelcomeEmail(name, email, createdAt);
      
      return res.status(201).json({ id,  name, email, createdAt, updatedAt });
    } catch (error) {
      return res.status(500).json({ message: "Error hashing the passowrd or user alredy created", error});
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { oldPassword, newPassword, newPasswordConfirmation, ...updateData} = req.body;

    try {
      const schema = z.object({
        name: z.string().min(4).optional(),
        email: z.string().email().min(11).optional(),
        oldPassword: z.string().min(8),
        newPassword: z.string().min(8).optional(),
        newPasswordConfirmation: z.string().refine(() => newPassword === newPasswordConfirmation, {
          message: 'New passwords does not match',
          path: ['passwordConfirmation']
        }).optional()
      });

      const validationResult = schema.safeParse(req.body);

      if (!oldPassword) return res.status(400).json('Old password is required.')

      if (!validationResult.success) return res.status(400).json(validationResult.error.message);

      if (oldPassword && newPassword < 8) return res.status(400).json('Passord should be greater than 7 characters.');

      if (newPassword !== newPasswordConfirmation) return res.status(401).json('Password and passord confirmation do not match');

      const user = await prisma.user.findUnique({
        where: {
          id: req.params.id,
        },
      })

      if (!user) {
        return res.status(404).json('User not found.');
      }
      
      if (oldPassword && !(await checkPassword(oldPassword, user.passwordHash))) return res.status(400).json('Old passord is incorrect.')

      if (newPassword) {
        const newPasswordHash = await bcrypt.hash(newPassword, 8)
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            ...updateData,
            passwordHash: newPasswordHash
          },
        })
      } else {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          data: updateData,
        })
      }

      const { id, name, email } = user;
      
      return res.status(200).json({ id, name, email });
    } catch (error) {
      return res.status(500).json({ message: 'Error on updating the user.', error})
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;

    const user = await prisma.user.delete({
      where: {
        id,
      },
    })
    
    return  res.status(204).json(user);
  }
}

export default new UsersController();

function sendWelcomEmail() {
  throw new Error('Function not implemented.');
}
