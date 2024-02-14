import { prisma } from '../utils/prismaClient';
import { Request, Response } from "express";
import * as z from 'zod';
import { sendFotoCreatedEmail } from '../emails/mailer';

class FotosController {
  async index(req: Request, res: Response): Promise<Response> {
    const fotos = await prisma.foto.findMany({
      where: {
        userId: req.params.userId,
      }
    });

    if (fotos.length <= 0) return res.status(404).json('There is no photos to display.');

    return res.status(200).json(fotos);
    //const page = req.query.page || 1;
    //const limit = req.query.limit || 25;
  }

  async  show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const foto = await prisma.foto.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if(!foto) return res.status(404).json("Photo not found.");

    return res.status(200).json(foto);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const schema = z.object({
        title: z.string().min(1, 'Title is too short').max(60, 'Title is too long'),
        category: z.string().min(1, 'Category is too short').max(60, 'Category is too long'),
        image_url: z.string().min(10, 'Image URL is too short'),
        userId: z.string().min(1, 'User ID is too short').max(60, 'User ID is too long'),
      });

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) return  res.status(400).json(validationResult.error.message);

      const { id, title, category, image_url, userId } = await prisma.foto.create({
        data: {
          ...req.body,
        }
      });

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        }
      })

      if (!user) return res.status(404).json('Error on find the owner of this photo');

      sendFotoCreatedEmail(user.name, user.email, title, category, image_url);

      return res.status(201).json({ id, title, category, image_url, userId })
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { ...updatedData } = req.body;

    try {
      const schema = z.object({
        title: z.string().min(1, 'Title is too short').max(60, 'Title is too long').optional(),
        category: z.string().min(1, 'Category is too short').max(60, 'Category is too long').optional(),
        image_url: z.string().min(10, 'Image URL is too short').optional(),
      });

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) return  res.status(400).json(validationResult.error.message);

      const foto = await prisma.foto.update({
        where: { id: req.params.id },
        data: {
          ...updatedData,
        }
      });

      if(!foto) return res.status(404).json('Photo not found');

      return res.status(200).json(foto);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const foto = await prisma.foto.delete({
      where: {
        id: req.params.id
      }
    });

    if (!foto)  return res.status(404).json("Photo not found.");

    return res.status(204).json(foto);
  }

  async deleteAllFotos(req: Request, res: Response): Promise<Response> {
    const fotos = await prisma.foto.deleteMany({
      where: {
        userId: req.params.userId
      }
    });

    if (!fotos)  return res.status(404).json("Photos not found.");

    return res.status(204).json(fotos);
  }
}

export default new FotosController();