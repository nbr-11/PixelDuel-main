import React from "react";
import Link from "next/link";
import LoginForm from "@/components/auth/Login";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

const Login: React.FC = async () => {

    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return <div className="h-screen w-full flex justify-center items-center p-2">
        <div className="w-[550px] bg-white rounded-xl shadow-lg py-5 px-10">
            <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >PixelDuel</h1>
            <h1 className="text-3xl font-bold">Login</h1>
            <p>Welcome Back</p>

            <LoginForm />

            <p className="text-center mt-2">
                Don't have an account ? {" "}

                <strong>
                    <Link href={"/register"}>Register</Link>
                </strong>
            </p>
        </div>
    </div>
}

export default Login;