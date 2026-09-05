import ResetPasswordForm from "@/components/auth/ResetPassword";
import React, { Suspense } from "react";

const Page: React.FC = () => {
    return <div className="h-screen w-full flex justify-center items-center p-2">
        <div className="w-[550px] bg-white rounded-xl shadow-lg py-5 px-10">
            <h1 className="text-4xl text-center font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >PixelDuel</h1>
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <Suspense>
                <ResetPasswordForm />
            </Suspense>
        </div>
    </div>
}

export default Page;