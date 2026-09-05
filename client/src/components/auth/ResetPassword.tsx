"use client"

import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import SubmitBtn from "../common/SubmitBtn"
import { useFormState } from "react-dom";
import { resetPasswordAction } from "@/actions/auth.actions";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

const ResetPasswordForm: React.FC = () => {

    const initialState = {
        status: 0,
        message: "",
        errors: {}
    }

    const [state, formAction] = useFormState(resetPasswordAction, initialState);
    const sParams = useSearchParams();


    useEffect(() => {
        if (state.status == 500) {
            toast.error("Something went wrong");
        } else if (state.status == 200) {
            toast.success("Password updated successfully");
        }
    }, [state])

    return <form action={formAction}>

        <input type="text" name="token" className="hidden" value={sParams.get("token") ?? ""} />
        <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="johndoe@example.com" readOnly value={sParams.get("email") ?? ""} />
            <span className='text-red-500'>{state?.errors?.email}</span>
        </div>
        <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" placeholder="Enter your password" />
            <span className='text-red-500'>{state?.errors?.password}</span>

        </div>

        <div className="mt-4">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input id="confirm_password" type="password" name="confirm_password" placeholder="Enter your password" />
            <span className='text-red-500'>{state?.errors?.confirm_password}</span>
        </div>

        <div className="mt-4 block ">
            <SubmitBtn />
        </div>
    </form>
}

export default ResetPasswordForm;