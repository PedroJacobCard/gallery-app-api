import * as nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv({
  path: ["../../../.env", '.env']
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_EMAIL_ADDRESS,
    pass: process.env.USER_EMAIL_PASS
  }
});

export async function sendWelcomeEmail(name: string, email: string, createdAt: Date) {
  try {
    const info = await transporter.sendMail({
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
    })
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log(error);
  }
}

export async function sendFotoCreatedEmail(userName: string, userEmail: string, title: string, category: string, image_url: string) {
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
  } catch (error) {
    return console.log(error)
  }
}