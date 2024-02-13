"use strict";

const { configDotenv } = require("dotenv");

configDotenv({
  path: ['../../../.env', '.env'],
})
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendFotoCreatedEmail = exports.sendWelcomeEmail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_EMAIL_ADDRESS,
        pass: process.env.USER_EMAIL_PASS
    }
});
function sendWelcomeEmail(name, email, createdAt) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail({
                from: 'Pedro Jacob <pedrojacob05cardoso@gmail.com>',
                to: email,
                subject: 'Welcome to My Gallery! 🎉',
                text: 'Welcome to our service! We are excited to have you on board.',
                html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <style>
    table, td, div, h1, p {
      font-family: Arial, sans-serif;
    }
    @media screen and (max-width: 530px) {
      header {
        text-decoration: none !important;
        font-weight: bold;
        width: 100%;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        background-color: #84ab7a3d;
      }
    }
    @media screen and (min-width: 531px) {
      .col-sml {
        max-width: 27% !important;
        display: flex; 
        flex-direction: 
        column;
      }
      .col-lge {
        max-width: 73% !important;
      }
    }
  </style>
</head>

<body>
  <header>
    <a href="https://ibb.co/B4dmjjS"><img src="https://i.ibb.co/M8Wbpp3/Frame-8.png" alt="Frame-8" border="0" width="150px" height="auto" style="margin: 2rem auto 0;"/></a>

    <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans; margin-left: 2rem;">
      <h1>Hello, ${name}! Here is Pedro from My Gallery 😜. <br/> Welcome to our App!</h1>
      <p style="font-size: larger;">You've successefully created an account <br/>
        and can now start exploring the world of art!</p>
    </div>
  </header>
  <main
    style="padding: 0 2rem; display:flex; flex-direction: column; justify-content:center; align-items:center; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans; margin-top: 2rem;">
    <h1 style="margin: 0 auto; font-weight: 500;">Here is your account details:</h1>
    <div class="cl-sm">
      <h2>Name: ${name}</h2>
      <h2>Email: ${email}</h2>
      <h2>Created at: ${createdAt}</h2>
    </div>
  </main>
</body>
</html>`,
            });
            console.log('Message sent: %s', info.messageId);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.sendWelcomeEmail = sendWelcomeEmail;
function sendFotoCreatedEmail(userName, userEmail, title, category, image_url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = transporter.sendMail({
                from: 'Pedro Jacob <pedrojacob05cardoso@gmail.com>',
                to: userEmail,
                subject: 'Welcome to My Gallery! 🎉',
                text: 'Welcome to our service! We are excited to have you on board.',
                html: `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <style>
    table, td, div, h1, p {
      font-family: Arial, sans-serif;
    }
    @media screen and (max-width: 530px) {
      header {
        text-decoration: none !important;
        font-weight: bold;
        width: 100%;
        padding: 0 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        background-color: #84ab7a3d;
      }
    }
    @media screen and (min-width: 531px) {
      .col-sml {
        max-width: 27% !important;
        display: flex; 
        flex-direction: 
        column;
      }
      .col-lge {
        max-width: 73% !important;
      }
    }
  </style>
</head>

<body>
  <header>
    <a href="https://ibb.co/B4dmjjS"><img src="https://i.ibb.co/M8Wbpp3/Frame-8.png" alt="Frame-8" border="0" width="150px" height="auto" style="margin: 2rem auto 0;"/></a>

    <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans; margin-left: 2rem;">
      <h1>Hello, ${userName}! Here is Pedro from My Gallery 😜</h1>
      <p style="font-size: larger;">You've successefully created a new photo!</p>
    </div>
  </header>
  <main
    style="padding: 0 2rem; display:flex; flex-direction: column; justify-content:center; align-items:center; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans; margin-top: 2rem;">
    <h1 style="margin: 0 auto; font-weight: 500;">Here is your photo details:</h1>
    <div class="cl-sm">
      <h2>Title: ${title}</h2>
      <h2>Category: ${category}</h2>
      <img src="${image_url}" alt="${title}" width="100px" height="auto">
    </div>
  </main>
</body>
</html>`,
            });
        }
        catch (error) {
            return console.log(error);
        }
    });
}
exports.sendFotoCreatedEmail = sendFotoCreatedEmail;
