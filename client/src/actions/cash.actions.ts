"use server"

import { revalidateTag } from "next/cache"

export const revalidateCash = (tag: string) => {
    revalidateTag(tag);
}