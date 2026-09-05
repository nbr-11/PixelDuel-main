import React from "react";
import Navbar from "@/components/base/Navbar";
import { getDuelById } from "@/app/fetch/getDuels";
import DuelPublic from "@/components/duel/DuelPublic";
import Image from "next/image";

const duelItems: React.FC<{ params: { id: string } }> = async ({ params }) => {

    const duel: duelResponseType = await getDuelById(Number(params.id));

    if (new Date(duel.expire_at) <= new Date(Date.now())) {
        return (<div className="container mx-auto px-2 flex flex-col justify-center items-center">

            <Image src={'/expired.svg'} height={500} width={500} alt="expired">

            </Image>

            <h1 className="text-center text-lg font-extrabold">The Duel has Expired</h1>
        </div>
        )
    }

    return (

        <div className="mx-auto container px-2">
            <Navbar />
            <div className="mt-4">
                <h1 className="text-2xl lg:text-4xl font-extrabold">{`${duel?.title}`}</h1>
                <p className="text-lg">{`${duel?.description}`}</p>
            </div>


            {
                duel && <DuelPublic duel={duel} />
            }




        </div>

    )
}


export default duelItems;