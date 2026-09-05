import { Request, Response } from "express";
import prisma from "../config/db.js";

export const verifyController = async (req: Request, res: Response) => {

    const { email, token } = req.query;

    if (email && token) {

        const user = await prisma.user.findUnique({
            where: {
                email: email as string,
            }
        });

        if (user) {
            if (token == user.email_verify_token) {

                await prisma.user.update({
                    where: {
                        email: email as string,
                    },
                    data: {
                        email_verify_token: null,
                        email_verified_at: new Date().toISOString(),
                    }
                });

                //redirect to the frontend login page

                return res.redirect(`${process.env.CLIENT_APP_URL}/login`);

            }
        }


        return res.redirect('verify-error');
    }
    return res.redirect('verify-error');
}

export const verifyErrorController = async (req: Request, res: Response) => {
    return res.render("auth/emailVerifyErrorPage");
}