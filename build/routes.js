"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsersController_1 = __importDefault(require("./app/controllers/UsersController"));
const FotosController_1 = __importDefault(require("./app/controllers/FotosController"));
const SessionsController_1 = __importDefault(require("./app/controllers/SessionsController"));
const auth_1 = __importDefault(require("./app/middlewares/auth"));
const routes = (0, express_1.Router)();
const users = UsersController_1.default;
const fotos = FotosController_1.default;
const sessions = SessionsController_1.default;
//create session
routes.post('/sessions', sessions.createSession);
//create a user
routes.post('/users', users.create);
//private route
routes.use(auth_1.default);
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
exports.default = routes;
