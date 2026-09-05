import { revalidateCash } from "@/actions/cash.actions";
import { NextResponse } from "next/server";

export const GET = async () => {
    revalidateCash("dashboard");

    return NextResponse.json({
        "message": "revalidation successfull"
    })
}