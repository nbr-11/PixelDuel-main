"use client"

import React, { useEffect } from "react";
import { registerActions } from "@/actions/auth.actions";
import SubmitBtn from "../common/SubmitBtn";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useFormState } from "react-dom";
import { toast } from "sonner";

const Register: React.FC = () => {

    const initialState = {
        status: 0,
        message: "",
        errors: {}
    }

    const [state, formAction] = useFormState(registerActions, initialState);

    useEffect(() => {

        if (state.status == 500) {
            toast.error(state.message);
        } else if (state.status == 200) {
            toast.success(state.message);
        }
    }, [state]);

    return (
        <form action={formAction}>
            <div className="mt-4">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" name="name" placeholder="john doe" />
                <span className="text-red-500">{state?.errors?.name}</span>
            </div>

            <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="johndoe@example.com" />
                <span className="text-red-500">{state?.errors?.email}</span>
            </div>
            <div className="mt-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" placeholder="Enter your password" />
                <span className="text-red-500">{state?.errors?.password}</span>
            </div>

            <div className="mt-4">
                <Label htmlFor="confirm_password">Confirm Passsword</Label>
                <Input id="confirm_password" type="password" name="confirm_password" placeholder="Enter the password" />
                <span className="text-red-500">{state?.errors?.confirm_password}</span>
            </div>

            <SubmitBtn />
        </form>
    )
}

export default Register