"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../config/auth"));
function default_1(req, res, next) {
    const authHeaders = req.headers.authorization;
    if (!authHeaders)
        return res.status(401).json("Token was not provided.");
    const [, token] = authHeaders.split(' ');
    try {
        jsonwebtoken_1.default.verify(token, auth_1.default.secret);
        return next();
    }
    catch (error) {
        return res.status(401).json('Invalid Token');
    }
}
exports.default = default_1;
