import React from "react";
import Link from "next/link";
import RegisterForm from "@/components/auth/Register";

const Register: React.FC = () => {
    return <div className="h-screen w-full flex justify-center items-center p-2">
        <div className="w-[550px] bg-white rounded-xl shadow-lg py-5 px-10">
            <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >PixelDuel</h1>
            <h1 className="text-3xl font-bold">Register</h1>
            <p>Welcome</p>

            <RegisterForm />

            <p className="text-center mt-2">
                Already have an account ? {" "}

                <strong>
                    <Link href={"/login"}>Login</Link>
                </strong>
            </p>
        </div>
    </div>
}

export default Register;