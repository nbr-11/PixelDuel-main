import { z } from "zod";

export const duelSchema = z.object({

    title: z.string({ message: "Title is required" })
        .min(3, { message: "Title must be 3 characters long." })
        .max(200, { message: "Title must be less than 200 characters" }),

    description: z.string({ "message": "Description is required" })
        .min(3, { message: "The description must be a minimum of three characters" })
        .max(1000, { message: "Must be less than 1000 characters" }),

    expire_at: z.string({ message: "Exprire time is required" })
        .min(5, { message: "Invalid date" }),

    image: z.string().optional()
});
