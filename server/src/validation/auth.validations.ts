import { z } from "zod";

export const registerSchema = z.object({
    name: z.string({ message: "Name is required" }).min(3, { message: "Name must be atleast 3 characters long" }),
    email: z.string({ message: "Email is required" }).email({ message: "Invalid email" }),
    password: z.string({ message: "password is required" }).min(6, { message: "password must be at least 6 characters long" }),
    confirm_password: z.string({ message: "password is required" }).min(6, { message: "password must be at least 6 characters long" }),

})

    .refine((parameter) => parameter.password == parameter.confirm_password, { message: "Passwords not matched", path: ["confirm_password"] });


export const loginSchema = z.object({
    email: z.string({ message: "email is required" }).email({ "message": "email is invalid" }),
    password: z.string({ message: "password is required" })
});


export const forgetPasswordSchema = z.object({
    email: z.string({ message: "email is required" }).email({ message: "email is invalid" })
});


export const resetPasswordSchema = z.object({
    email: z.string({ message: "Email is required" }).email({ message: "email is invalid" }),
    token: z.string(),
    password: z.string({ message: "Password is required" }).min(6, { message: "The password must contain at least 6 characters" }),
    confirm_password: z.string({ message: "confirm password is required" }).min(6, { message: "The password must contain at least 6 characters" })
})

    .refine((parameter) => parameter.password === parameter.confirm_password, { "message": "Passwords didn't match", "path": ["confirm_password"] });