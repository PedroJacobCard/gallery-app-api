"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const allowsOrigin_1 = __importDefault(require("./app/config/allowsOrigin"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        dotenv_1.default.config();
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.server.use((0, cors_1.default)({
            origin: (origin, callback) => {
                if (allowsOrigin_1.default.indexOf(origin) !== -1 || !origin) {
                    return callback(null, true);
                }
                else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
            optionsSuccessStatus: 200,
            methods: 'GET, HEAD, PUT, POST, DELETE',
            allowedHeaders: 'Content-Type, Authorization',
        }));
        this.server.use(express_1.default.json());
    }
    routes() {
        this.server.use(routes_1.default);
    }
}
exports.default = new App().server;
