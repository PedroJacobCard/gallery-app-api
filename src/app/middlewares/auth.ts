import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import auth from "../config/auth";

export default function (req: Request, res: Response, next: NextFunction) {
  const authHeaders = req.headers.authorization;

  if (!authHeaders) return res.status(401).json("Token was not provided.");

  const [, token] = authHeaders.split(' ');

  try {
    jwt.verify(token, auth.secret as string);
    return next();
  } catch (error) {
    return res.status(401).json('Invalid Token');
  }
}