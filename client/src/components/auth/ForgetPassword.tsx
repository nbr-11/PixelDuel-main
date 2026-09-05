"use client";

import { forgetPassordAction } from "@/actions/auth.actions";
import React, { useEffect } from "react";
import { useFormState } from "react-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitBtn from "../common/SubmitBtn";
import { toast } from "sonner";

const ForgetPasswordForm: React.FC = () => {

    const initialState = {
        status: 0,
        message: "",
        errors: {},
        data: {}
    }

    const [state, formAction] = useFormState(forgetPassordAction, initialState);


    useEffect(() => {

        if (state?.status == 500) {
            toast.error("something went wrong");
        } else if (state?.status == 200) {
            toast.success("Check your email, we have sent you a link to reset your password");
        }
    }, [state]);

    return <>
        <form action={formAction}>

            <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="johndoe@example.com" />
                <span className='text-red-500'>{state?.errors?.email}</span>
            </div>

            <SubmitBtn />
        </form>
    </>
}


export default ForgetPasswordForm;

