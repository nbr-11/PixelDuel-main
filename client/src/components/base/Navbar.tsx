"use client"

import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AvatarLogo from "../common/AvatarLogo";
import LogoutModal from "../auth/LogoutModal";
import { useRouter } from "next/navigation";


const Navbar: React.FC = () => {

    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();

    return <>
        <LogoutModal open={open} setOpen={setOpen} />

        <nav className="flex justify-between items-center h-14 p-2 w-full">
            <h1 onClick={() => { router.push("/dashboard") }} className="text-4xl text-center font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >PixelDuel</h1>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <AvatarLogo name="Nishant" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setOpen(true) }}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    </>
}

export default Navbar;