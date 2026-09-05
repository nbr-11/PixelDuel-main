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
} from "@/components/ui/alert-dialog"
import axios from "axios";
import { DUEL_URL } from "@/lib/apiEndpoints";
import { revalidateCash } from "@/actions/cash.actions";
import { toast } from "sonner";


const DeleteDuel: React.FC<{ open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, id: number, token: string }> = ({ open, setOpen, id, token }) => {

    const deleteDuel = async () => {

        try {
            await axios.delete(DUEL_URL + `/${id}`, {
                headers: {
                    Authorization: token
                }
            });

            revalidateCash("dashboard");
            toast.success("Duel deleted successfully!");
        } catch (error) {
            toast.error("Something went wrong");
        }

    }

    return <>
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will delete your Duel permanently
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteDuel}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </>
}

export default DeleteDuel;