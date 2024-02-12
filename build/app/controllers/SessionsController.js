"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../utils/prismaClient");
const passwordCompare_1 = require("../utils/passwordCompare");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../config/auth"));
class SessionsController {
    createSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield prismaClient_1.prisma.user.findFirst({
                where: { email },
            });
            if (!user)
                return res.status(404).json('User not found.');
            if (password && !(yield (0, passwordCompare_1.checkPassword)(password, user.passwordHash)))
                return res.status(401).json("Invalid Password");
            const { id, name } = user;
            return res.status(200).json({
                user: {
                    id, name, email
                },
                token: jsonwebtoken_1.default.sign({ id }, auth_1.default.secret, {
                    expiresIn: auth_1.default.expires,
                })
            });
        });
    }
}
exports.default = new SessionsController();
