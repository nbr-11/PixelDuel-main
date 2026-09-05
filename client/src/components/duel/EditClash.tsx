"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"
import { DatePicker } from "../ui/datePicker";
import SubmitBtn from "../common/SubmitBtn";
import { DUEL_URL } from "@/lib/apiEndpoints";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { revalidateCash } from "@/actions/cash.actions";



const EditDuel: React.FC<{ token: string, duel: duelResponseType, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }> = ({ token, duel, open, setOpen }) => {


    const [date, setDate] = useState<Date | undefined>(new Date(duel.expire_at));
    const [duelData, setDuelData] = useState<DuelFormType>({
        title: duel.title,
        description: duel.description
    });
    const [image, setImage] = useState<File | undefined>(undefined);
    const [error, setError] = useState<DuelFormTypeError>();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("title", duelData?.title ?? "");
            formData.append("description", duelData?.description ?? "");
            formData.append("expire_at", date?.toISOString() ?? "")
            if (image) {
                formData.append("image", image);
            }

            const { data } = await axios.put(DUEL_URL + `/${duel.id}`, formData, {
                headers: {
                    Authorization: token
                }
            });


            if (data?.message) {
                revalidateCash("dashboard");
                setTimeout(() => {
                    revalidateCash("dashboard");
                }, 5000);
                setDuelData({
                    title: duel.title,
                    description: duel.description
                });
                setDate(new Date(duel.expire_at));
                setImage(undefined);
                setError({});
                toast.success("Duel Updated successfully !");
                setOpen(false);
            }

        } catch (error) {

            if (error instanceof AxiosError) {

                if (error.response?.status == 422) {
                    setError({
                        ...error.response?.data?.errors
                    });
                }

            } else {

                toast.error("Something went wrong");

            }


        }

    }

    return <>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-extrabold">Update the Duel</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            value={duelData?.title ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setDuelData({ ...duelData, title: e.target.value });
                            }}
                            id="title"
                            placeholder="Enter the title" />
                        <span className="text-red-500">{error?.title}</span>
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            value={duelData?.description ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setDuelData({ ...duelData, description: e.target.value });
                            }}
                            id="description"
                            placeholder="Enter the description" />
                        <span className="text-red-500">{error?.description}</span>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="image">Image</Label>
                        <Input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            placeholder="Select the image" />
                        <span className="text-red-500">{error?.image}</span>
                    </div>


                    <div className="mt-4">
                        <Label htmlFor="" className="mr-3">Expire At</Label>
                        <DatePicker date={date} setDate={setDate} />

                    </div>
                    <span className="text-red-500">{error?.expire_at}</span>

                    <SubmitBtn />
                </form>
            </DialogContent>
        </Dialog>

    </>
}

export default EditDuel;