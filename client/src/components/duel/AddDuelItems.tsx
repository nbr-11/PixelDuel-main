"use client"

import { Upload } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useState, useRef } from "react";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { DUEL_ITEMS_URL } from "@/lib/apiEndpoints";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



const AddDuelItems: React.FC<{ token: string, duelId: number }> = ({ token, duelId }) => {

    const [items, setItems] = useState<Array<duelItemFormType>>([
        { image: null },
        { image: null }
    ]);

    const [urls, setUrls] = useState<Array<string>>(["", ""]);

    const imageRef1 = useRef<HTMLInputElement | null>(null);
    const imageRef2 = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {

        const image = e.target.files?.[0];

        if (image) {
            const updatedItems = [...items];
            updatedItems[index].image = image;
            setItems(updatedItems);

            //creating url for preview

            const imageUrl = URL.createObjectURL(image);
            const updatedurls = [...urls];
            updatedurls[index] = imageUrl;
            setUrls(updatedurls);
        }

    }

    const handleSubmit = async () => {
        try {

            const formData = new FormData();
            formData.append("id", duelId.toString());

            items.map((item) => {
                if (item.image) {
                    formData.append(`images[]`, item.image);
                }
            });


            if (formData.get("images[]")) {
                setLoading(true);
                const { data } = await axios.post(DUEL_ITEMS_URL, formData, {
                    headers: {
                        Authorization: token
                    }
                });

                if (data?.message) {
                    toast.success(data?.message);

                    setTimeout(() => {
                        router.push("/dashboard");
                    }, 1500);

                    setLoading(false);

                }
            } else {
                toast.warning("Please upload both images");
            }


        } catch (error) {

            setLoading(false);

            if (error instanceof AxiosError) {
                if (error.response?.status == 422) {

                    if (error.response.data?.errors) {
                        error.response.data?.errors?.map((err: string) => {
                            toast.error(err);
                        })
                    }
                }
            } else {
                toast.error('Something went wrong please try again');
            }




        }
    }

    return <>
        <div className="mt-10">
            <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">

                {/* first block */}
                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                    <input type="file" className="hidden" ref={imageRef1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleImageChange(e, 0);
                    }} />

                    <div className="w-full flex justify-center items-center rounded-md border-4 border-dashed p-2 h-[300px] cursor-pointer" onClick={() => imageRef1?.current?.click()}>
                        {
                            urls?.[0] === "" ? (

                                <h1 className="flex gap-2 items-center justify-between">
                                    <Upload />
                                    Upload file
                                </h1>


                            ) : (
                                <Image src={urls?.[0]} height={300} width={300} alt="image" className="w-full h-full object-contain" />
                            )
                        }
                    </div>
                </div>

                {/* Vs Block */}

                <div className="w-full flex lg:w-auto justify-center items-center">
                    <h1 className="text-6xl text-center font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >VS</h1>
                </div>

                {/* second block */}
                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                    <input type="file" className="hidden" ref={imageRef2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleImageChange(e, 1);
                    }} />
                    <div className="w-full flex justify-center items-center rounded-md border-4 border-dashed p-2 h-[300px] cursor-pointer" onClick={() => imageRef2?.current?.click()}>
                        {
                            urls?.[1] === "" ? (

                                <h1 className="flex gap-2 items-center justify-between">
                                    <Upload />
                                    Upload file
                                </h1>


                            ) : (
                                <Image src={urls?.[1]} height={300} width={300} alt="image" className="w-full h-full object-contain" />
                            )
                        }

                    </div>
                </div>
            </div>

            <div className="text-center">
                <Button className="w-50 mt-3" onClick={handleSubmit} disabled={loading}>
                    {
                        loading ? "Processing..." : "Submit"
                    }
                </Button>
            </div>
        </div>
    </>
}



export default AddDuelItems;