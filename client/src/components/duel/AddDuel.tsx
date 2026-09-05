"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"
import { DatePicker } from "../ui/datePicker";
import SubmitBtn from "../common/SubmitBtn";
import { DUEL_URL } from "@/lib/apiEndpoints";
import axios, { AxiosError } from "axios";
import { CustomUser } from "@/app/api/auth/[...nextauth]/options";
import { toast } from "sonner";
import { revalidateCash } from "@/actions/cash.actions";



const AddDuel: React.FC<{ user: CustomUser }> = ({ user }) => {

    const [open, setOpen] = useState<boolean>(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [duelData, setDuelData] = useState<DuelFormType>();
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
            console.log(process.env.NEXT_PUBLIC_BACKEND_APP_URL);
            const { data } = await axios.post(DUEL_URL, formData, {
                headers: {
                    Authorization: user.token
                }
            });


            if (data?.message) {
                //not a good practise
                revalidateCash("dashboard");
                setTimeout(() => {
                    revalidateCash("dashboard");
                }, 5000);

                setDuelData({});
                setDate(undefined);
                setImage(undefined);
                setError({});
                toast.success("Duel added successfully !");
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
            <DialogTrigger asChild>
                <Button>
                    Add Duel
                </Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-extrabold">Create a Duel</DialogTitle>
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

export default AddDuel;