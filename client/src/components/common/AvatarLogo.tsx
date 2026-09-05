import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const AvatarLogo: React.FC<{ name: string }> = ({ name }) => {
    return <>

        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>

    </>
}

export default AvatarLogo;