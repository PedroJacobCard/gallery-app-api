"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const checkPassword = (password, passwordHash) => {
    return bcryptjs_1.default.compare(password, passwordHash);
};
exports.checkPassword = checkPassword;
