"use client"

import React, { useEffect } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import SubmitBtn from '../common/SubmitBtn';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { loginActions } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

const Login: React.FC = () => {

    const initialState = {
        status: 0,
        message: "",
        errors: {},
        data: {}
    }

    const [state, formAction] = useFormState(loginActions, initialState);

    useEffect(() => {

        if (state.status == 500) {
            toast.error(state.message);
        } else if (state.status == 200) {
            toast.success(state.message);
            signIn("credentials", {
                email: state?.data?.email as string,
                password: state?.data?.password as string,
                redirect: true,
                callbackUrl: "/dashboard",
            });

        }

    }, [state]);

    return (
        <form action={formAction}>
            <div className="mt-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="johndoe@example.com" />
                <span className='text-red-500'>{state?.errors?.email}</span>
            </div>
            <div className="mt-4">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name="password" placeholder="Enter your password" />
                <span className='text-red-500'>{state?.errors?.password}</span>
                <div className="block w-full text-end mt-2">
                    <Link href="/forget-password " className="font-bold">Forgot Password ?</Link>
                </div>
            </div>

            <div className="mt-4 block ">
                <SubmitBtn />
            </div>
        </form>
    )
}

export default Login;