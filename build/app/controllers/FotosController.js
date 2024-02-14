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
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../utils/prismaClient");
const z = __importStar(require("zod"));
const mailer_1 = require("../emails/mailer");
class FotosController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fotos = yield prismaClient_1.prisma.foto.findMany({
                where: {
                    userId: req.params.userId,
                }
            });
            if (fotos.length <= 0)
                return res.status(404).json('There is no photos to display.');
            return res.status(200).json(fotos);
            //const page = req.query.page || 1;
            //const limit = req.query.limit || 25;
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const foto = yield prismaClient_1.prisma.foto.findUnique({
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
            if (!foto)
                return res.status(404).json("Photo not found.");
            return res.status(200).json(foto);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schema = z.object({
                    title: z.string().min(1, 'Title is too short').max(60, 'Title is too long'),
                    category: z.string().min(1, 'Category is too short').max(60, 'Category is too long'),
                    image_url: z.string().min(10, 'Image URL is too short'),
                    userId: z.string().min(1, 'User ID is too short').max(60, 'User ID is too long'),
                });
                const validationResult = schema.safeParse(req.body);
                if (!validationResult.success)
                    return res.status(400).json(validationResult.error.message);
                const { id, title, category, image_url, userId } = yield prismaClient_1.prisma.foto.create({
                    data: Object.assign({}, req.body)
                });
                const user = yield prismaClient_1.prisma.user.findUnique({
                    where: {
                        id: userId,
                    }
                });
                if (!user)
                    return res.status(404).json('Error on find the owner of this photo');
                (0, mailer_1.sendFotoCreatedEmail)(user.name, user.email, title, category, image_url);
                return res.status(201).json({ id, title, category, image_url, userId });
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedData = __rest(req.body, []);
            try {
                const schema = z.object({
                    title: z.string().min(1, 'Title is too short').max(60, 'Title is too long').optional(),
                    category: z.string().min(1, 'Category is too short').max(60, 'Category is too long').optional(),
                    image_url: z.string().min(10, 'Image URL is too short').optional(),
                });
                const validationResult = schema.safeParse(req.body);
                if (!validationResult.success)
                    return res.status(400).json(validationResult.error.message);
                const foto = yield prismaClient_1.prisma.foto.update({
                    where: { id: req.params.id },
                    data: Object.assign({}, updatedData)
                });
                if (!foto)
                    return res.status(404).json('Photo not found');
                return res.status(200).json(foto);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foto = yield prismaClient_1.prisma.foto.delete({
                where: {
                    id: req.params.id
                }
            });
            if (!foto)
                return res.status(404).json("Photo not found.");
            return res.status(204).json(foto);
        });
    }
    deleteAllFotos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fotos = yield prismaClient_1.prisma.foto.deleteMany({
                where: {
                    userId: req.params.userId
                }
            });
            if (!fotos)
                return res.status(404).json("Photos not found.");
            return res.status(204).json(fotos);
        });
    }
}
exports.default = new FotosController();
