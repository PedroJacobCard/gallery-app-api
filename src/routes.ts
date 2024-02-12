import { Router } from "express";

import UsersController from "./app/controllers/UsersController";
import FotosController from "./app/controllers/FotosController";
import SessionsController from "./app/controllers/SessionsController";

import authMiddleware from "./app/middlewares/auth";

const routes: Router = Router();

const users = UsersController;
const fotos = FotosController;
const sessions = SessionsController;

//create session
routes.post('/sessions', sessions.createSession);

//create a user
routes.post('/users', users.create);

//private route
routes.use(authMiddleware);

//Users routes
routes.get('/users', users.index);
routes.get('/users/login', users.show);
routes.put('/users/:id', users.update);
routes.delete('/users/:id', users.delete);

//Fotos routes
routes.get('/users/:userId/fotos', fotos.index);
routes.get('/users/:userId/fotos/:id', fotos.show);
routes.post('/fotos', fotos.create);
routes.put('/fotos/:id', fotos.update);
routes.delete('/fotos/:id', fotos.delete);
routes.delete('/users/:userId/fotos', fotos.deleteAllFotos);

export default routes;