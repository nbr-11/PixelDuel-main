"use client"
import React, { Dispatch, SetStateAction } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { signOut } from "next-auth/react";


const LogoutModal: React.FC<{ open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({ open, setOpen }) => {

    const logoutUser = () => {
        signOut({
            callbackUrl: "/login",
            redirect: true
        });
    }

    return <>
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will delete you current session and you will have to login again
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={logoutUser}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </>
}

export default LogoutModal;