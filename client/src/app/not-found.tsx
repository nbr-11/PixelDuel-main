import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const NotFound: React.FC = () => {
    return <div className="w-screen h-screen flex flex-col justify-center items-center p-4">
        <Image src="/404.svg" width={600} height={600} className="w-[80%] h-[80%]" alt="Page Not Found" />
        <Link href={"/"}>
            <Button>Return Home</Button>
        </Link>
    </div>
}

export default NotFound;