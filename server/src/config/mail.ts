import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

export const send = async (to: string, subject: string, body: string) => {

    return await transporter.sendMail({
        from: `no-reply ${process.env.SMTP_USER}`,
        to: to,
        subject: subject,
        html: body

    })
}