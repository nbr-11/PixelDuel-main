"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { Textarea } from "../ui/textarea";
import SubmitBtn from "../common/SubmitBtn";
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import socket from "@/lib/socket";
import { toast } from "sonner";

const DuelPublic: React.FC<{ duel: duelResponseType }> = ({ duel }) => {

    const [duelComments, setDuelComments] = useState<DuelComment[]>(duel.DuelComment);
    const [duelItems, setDuelItems] = useState<DuelItem[]>(duel.DuelItem);
    const [comment, setComment] = useState<string>("");
    const [hideVote, setHideVote] = useState<boolean>(false);


    const handleVote = (id: number) => {
        if (duelItems && duelItems.length > 0) {
            setHideVote(true);
            updateCounter(id);
            // socket related work

            //we will emit a dynamic emit
            socket.emit(`duel-${duel.id}`, {
                duelId: duel.id,
                duelItemId: id
            });
        }
    }

    useEffect(() => {
        socket.on(`duel-${duel.id}`, (data) => {
            updateCounter(data?.duelItemId);
        });

        socket.on(`duel_comment-${duel.id}`, (data) => {
            updateComment(data);
        });
    }, []);


    const updateCounter = (id: number) => {
        const items = [...duelItems];
        const findIndex = duelItems.findIndex((item) => item.id === id);

        if (findIndex !== -1) {
            items[findIndex].count += 1;
        }

        setDuelItems(items);
    }


    const handleComment = (event: React.FormEvent) => {

        event.preventDefault();

        if (comment.length > 2) {
            const payload = {
                duelId: duel.id,
                comment: comment,
                created_at: new Date().toDateString()
            }

            updateComment(payload);
            socket.emit(`duel_comment-${duel.id}`, payload);
            setComment("");
        } else {
            toast.warning("Please type at least 2 letters")
        }

    }

    const updateComment = (payload: any) => {
        if (duelComments && duelComments.length > 0) {
            setDuelComments([payload, ...duelComments]);
        } else {
            setDuelComments([payload]);
        }
    }

    return <>

        <div className="mt-10">
            <div className="flex flex-wrap lg:flex-nowrap justify-between items-center">
                {
                    duelItems && duelItems.length > 0 && duelItems.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <div className="w-full lg:w-[500px] flex justify-center items-center flex-col">
                                    <div className="w-full flex justify-center items-center rounded-md p-2 h-[300px] cursor-pointer">
                                        <Image src={item.image} height={300} width={300} alt="image" className="w-full h-full object-contain" />
                                    </div>
                                    {
                                        hideVote ? (<CountUp
                                            start={0}
                                            end={item.count}
                                            duration={2}
                                            className="text-5xl font-extrabold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent"
                                        />) : (
                                            <Button onClick={() => handleVote(item.id)}>
                                                <span className="mr-2 text-lg">Vote</span> <ThumbsUp />
                                            </Button>)
                                    }

                                </div>

                                {/* Vs Block */}
                                {/* Vs Block is shown only in even position so this logic is used */}
                                {
                                    index % 2 === 0 &&
                                    <div className="w-full flex lg:w-auto justify-center items-center">
                                        <h1 className="text-6xl text-center font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >VS</h1>
                                    </div>
                                }


                            </React.Fragment>
                        )
                    })
                }
            </div>


            {/* comments */}

            <form className="mt-4" onSubmit={handleComment}>
                <Textarea placeholder="Give your feedback 😊" value={comment} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    setComment(e.target.value)
                }} />

                <SubmitBtn />
            </form>
            <div >

                <div className="mt-4">
                    {
                        duelComments && duelComments.length > 0 && duelComments.map((item, index) => {
                            return <>
                                <div key={index} className="w-full md:w-600px rounded-lg p-4 bg-muted">

                                    <p className="font-bold">{item.comment}</p>
                                    <p>{new Date(duel.created_at).toDateString()}</p>

                                </div>
                            </>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}

export default DuelPublic;