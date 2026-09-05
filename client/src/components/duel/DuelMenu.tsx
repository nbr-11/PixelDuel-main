"use client"

import React, { Suspense, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from "lucide-react";
import dynamic from "next/dynamic";
import { Env } from "@/lib/env";
import { toast } from "sonner";

const EditDuel = dynamic(() => import("./EditClash"));
const DeleteDuel = dynamic(() => import("./DeleteDuel"));

const DuelMenu: React.FC<{ duel: duelResponseType, token: string }> = ({ duel, token }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(`${Env.APP_URL}/duel/${duel.id}`);
        toast.success("Link copied !");
    }

    return <>

        <Suspense fallback={"Loading..."}>
            <EditDuel duel={duel} open={open} setOpen={setOpen} token={token} />
            <DeleteDuel open={deleteOpen} setOpen={setDeleteOpen} token={token} id={duel.id} />
        </Suspense>


        <DropdownMenu>
            <DropdownMenuTrigger>
                <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setOpen(true)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>Copy Link</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    </>
}

export default DuelMenu;