import { Request, Response } from "express";
import { forgetPasswordSchema, resetPasswordSchema } from "../validation/auth.validations.js";
import { ZodError } from "zod";
import { checkDateDiff, formatError, renderEmailEjs } from "../helper.js";
import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuid4 } from "uuid";
import { emailQueue, emailQueueName } from "../jobs/EmailJob.js";

export const forgetPasswordController = async (req: Request, res: Response) => {
    try {

        const body = req.body;
        const payload = forgetPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (!user || user === null) {
            return res.status(422).json({
                errors: {
                    email: "no user found with this email"
                }
            });
        }

        //generate a token

        const token = await bcrypt.hash(uuid4(), 10);

        //set the token in the db (there is a problem here what if the queue is down)

        await prisma.user.update({
            where: {
                email: payload.email
            },
            data: {
                password_reset_token: token,
                token_send_at: new Date().toISOString()
            }
        });

        const url = `${process.env.CLIENT_APP_URL}/reset-password?email=${payload.email}&token=${token}`

        const html = await renderEmailEjs("forget-password", { url: url });

        //add email to the queue
        await emailQueue.add(emailQueueName, {
            to: user.email,
            subject: "Reset Password",
            body: html
        });


        return res.status(200).json({
            message: "Password reset link sent successfully, please check your email "
        });

    } catch (error) {

        if (error instanceof ZodError) {
            const errors = formatError(error);

            return res.status(422)
                .json({
                    message: "Invalid data",
                    errors: errors
                });
        }

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

export const resetPasswordController = async (req: Request, res: Response) => {
    try {

        const body = req.body;
        const payload = resetPasswordSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (!user || user == null) {

            return res.status(422).json({
                message: "Invalid Data",
                errors: {
                    email: "Link is not correct make sure you are pasting the correct link"
                }
            });
        }

        // check if the token is the same

        if (user.password_reset_token !== payload.token) {
            return res.status(422).json({
                message: "Invalid Data",
                errors: {
                    email: "Link is not correct make sure you are pasting the correct link"
                }
            });
        }

        // expiry for the token

        const diff = checkDateDiff(user.token_send_at!);

        if (diff > 1) {
            return res.status(422).json({
                message: "Invalid Data",
                errors: {
                    email: "Token expired"
                }
            });
        }

        // Update password

        payload.password = await bcrypt.hash(payload.password, 10);

        await prisma.user.update({
            where: {
                email: payload.email
            },
            data: {
                password: payload.password,
                password_reset_token: null,
                token_send_at: null,
            }
        });


        return res.status(200).json({
            "message": "Password updated successfully",
            errors: {}
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
            message: "Somehting went wrong"
        });
    }
}