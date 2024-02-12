"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../utils/prismaClient");
const z = __importStar(require("zod"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passwordCompare_1 = require("../utils/passwordCompare");
const mailer_1 = require("../emails/mailer");
class UsersController {
    index(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prismaClient_1.prisma.user.findMany({
                select: { id: true, name: true, email: true, passwordHash: false, createdAt: true, updatedAt: true, fotos: {
                        select: { id: true }
                    } },
            });
            return res.status(200).json(users);
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const schema = z.object({
                email: z.string().email().min(11),
                password: z.string().min(8),
            });
            const validationResult = schema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json(validationResult.error.message);
            }
            const user = yield prismaClient_1.prisma.user.findUnique({
                where: {
                    email,
                }
            });
            if (password && !(yield (0, passwordCompare_1.checkPassword)(password, (user === null || user === void 0 ? void 0 : user.passwordHash) || '')))
                return res.status(400).json('Email or password is incorrect.');
            if (!user) {
                return res.status(400).json('User not found');
            }
            const { id, name, createdAt, updatedAt } = user;
            return res.status(200).json({ id, name, email, createdAt, updatedAt });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                if (!validationResult.success)
                    return res.status(400).json(validationResult.error.message);
                if (password !== passwordConfirmation)
                    return res.status(400).json('Password and Password Confirmation do not match.');
                if (password !== passwordConfirmation)
                    return res.status(401).json('Password and passord confirmation do not match');
                const passwordHash = yield bcryptjs_1.default.hash(password, 8);
                const user = yield prismaClient_1.prisma.user.create({
                    data: {
                        name: name,
                        email: email,
                        passwordHash: passwordHash
                    }
                });
                if (!user)
                    return res.status(404).json("User not Found");
                const { id, createdAt, updatedAt } = user;
                (0, mailer_1.sendWelcomeEmail)(name, email, createdAt);
                return res.status(201).json({ id, name, email, createdAt, updatedAt });
            }
            catch (error) {
                return res.status(500).json({ message: "Error hashing the passowrd or user alredy created", error });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { oldPassword, newPassword, newPasswordConfirmation } = _a, updateData = __rest(_a, ["oldPassword", "newPassword", "newPasswordConfirmation"]);
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
                if (!oldPassword)
                    return res.status(400).json('Old password is required.');
                if (!validationResult.success)
                    return res.status(400).json(validationResult.error.message);
                if (oldPassword && newPassword < 8)
                    return res.status(400).json('Passord should be greater than 7 characters.');
                if (newPassword !== newPasswordConfirmation)
                    return res.status(401).json('Password and passord confirmation do not match');
                const user = yield prismaClient_1.prisma.user.findUnique({
                    where: {
                        id: req.params.id,
                    },
                });
                if (!user) {
                    return res.status(404).json('User not found.');
                }
                if (oldPassword && !(yield (0, passwordCompare_1.checkPassword)(oldPassword, user.passwordHash)))
                    return res.status(400).json('Old passord is incorrect.');
                if (newPassword) {
                    const newPasswordHash = yield bcryptjs_1.default.hash(newPassword, 8);
                    yield prismaClient_1.prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: Object.assign(Object.assign({}, updateData), { passwordHash: newPasswordHash }),
                    });
                }
                else {
                    yield prismaClient_1.prisma.user.update({
                        where: {
                            id: user.id,
                        },
                        data: updateData,
                    });
                }
                const { id, name, email } = user;
                return res.status(200).json({ id, name, email });
            }
            catch (error) {
                return res.status(500).json({ message: 'Error on updating the user.', error });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const user = yield prismaClient_1.prisma.user.delete({
                where: {
                    id,
                },
            });
            return res.status(204).json(user);
        });
    }
}
exports.default = new UsersController();
function sendWelcomEmail() {
    throw new Error('Function not implemented.');
}
