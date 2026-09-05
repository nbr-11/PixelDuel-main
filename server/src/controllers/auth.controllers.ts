import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../validation/auth.validations.js";
import { ZodError } from "zod";
import { formatError, renderEmailEjs } from "../helper.js";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/EmailJob.js";
import jwt from "jsonwebtoken";

export const registerController = async (req: Request, res: Response) => {

    try {
        const body = req.body;
        const payload = registerSchema.parse(body);

        let user = await prisma.user.findUnique({
            where: {
                email: payload.email,
            }
        })

        if (user) {
            return res.status(422).json({
                errors: {
                    email: "Email already taken,  please use another one"
                }
            });
        }

        // hash the password
        payload.password = await bcrypt.hash(payload.password, 10);

        //send a verfication email

        const token = await bcrypt.hash(uuid4(), 10);
        const url = `${process.env.APP_URL}/api/verify-email?email=${payload.email}&token=${token}`;

        const emailHtml = await renderEmailEjs("email-verify", {
            name: payload.name,
            url: url
        });

        //add email to the queue
        await emailQueue.add(emailQueueName, {
            to: payload.email,
            subject: "Email Verification",
            body: emailHtml
        });

        //create an entry in db
        await prisma.user.create({
            data: {
                name: payload.name,
                email: payload.email,
                password: payload.password,
                email_verify_token: token
            }
        });

        return res
            .json({
                "message": "Please check your email. we have sent you a verification email"
            });

    } catch (error) {

        if (error instanceof ZodError) {
            const errors = formatError(error);

            return res.status(422).json({
                message: "Invalid Data",
                errors: errors
            });
        }

        return res.status(500).json({
            "message": "Something went wrong, please try again !"
        });

    }

}


export const loginController = async (req: Request, res: Response) => {
    try {

        const body = req.body;
        const payload = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (!user || user == null) {
            return res.status(422).json({
                errors: {
                    email: "No User found with this email"
                }
            });
        }

        //check if the email is verified

        if (!user.email_verified_at) {
            return res.status(422).json({
                errors: {
                    email: "Email was not verified"
                }
            });
        }

        //check for password

        const isPasswordSame = await bcrypt.compare(payload.password, user.password);

        if (!isPasswordSame) {

            return res.status(422).json({
                errors: {
                    email: "Invalid Credentials",
                    password: "Invalid Credentials"
                }
            });
        }

        //generate jwt token

        const JWTPayload = {
            id: user.id,
            name: user.name,
            email: user.email
        }

        const token = jwt.sign(JWTPayload, process.env.SECRET_KEY!, {
            expiresIn: "365d"
        });


        return res.json({
            message: "Logged in Successfully",
            data: {
                ...JWTPayload,
                token: `Bearer ${token}`
            }
        });



    } catch (error) {

        if (error instanceof ZodError) {

            const errors = formatError(error);
            return res.status(422).json({
                message: "Invalid Data",
                errors: errors,
            });
        }

        return res.status(500).json({
            "message": "Something went wrong, please try again !"
        });

    }
}

export const CheckCredentials = async (req: Request, res: Response) => {
    try {

        const body = req.body;
        const payload = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (!user || user == null) {
            return res.status(422).json({
                errors: {
                    email: "No User found with this email"
                }
            });
        }

        //check for email is verified
        if (!user.email_verified_at) {
            return res.status(422).json({
                errors: {
                    email: "Email was not verified"
                }
            });
        }

        //check for password

        const isPasswordSame = await bcrypt.compare(payload.password, user.password);

        if (!isPasswordSame) {

            return res.status(422).json({
                errors: {
                    email: "Invalid Credentials",
                    password: "Invalid Credentials"
                }
            });
        }


        return res.json({
            message: "Logged in Successfully",
        });



    } catch (error) {

        if (error instanceof ZodError) {

            const errors = formatError(error);
            return res.status(422).json({
                message: "Invalid Data",
                errors: errors,
            });
        }

        return res.status(500).json({
            "message": "Something went wrong, please try again !"
        });

    }
}