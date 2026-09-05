import React from "react";
import Navbar from "@/components/base/Navbar";
import { getDuelById } from "@/app/fetch/getDuels";
import AddDuelItems from "@/components/duel/AddDuelItems";
import { authOptions, CustomSession } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import ViewDuelItem from "@/components/duel/ViewDuelItems";
import { redirect } from "next/navigation";

const duelItems: React.FC<{ params: { id: string } }> = async ({ params }) => {

    const duel: duelResponseType = await getDuelById(Number(params.id));

    const session: CustomSession | null = await getServerSession(authOptions);


    if (session) {
        return (

            <div className="mx-auto container px-2">
                <Navbar />
                <div className="mt-4">
                    <h1 className="text-2xl lg:text-4xl font-extrabold">{`${duel?.title}`}</h1>
                    <p className="text-lg">{`${duel?.description}`}</p>
                </div>

                {
                    duel?.DuelItem && duel?.DuelItem?.length > 0 ? (
                        <ViewDuelItem duel={duel} />
                    ) : (
                        <AddDuelItems token={session?.user?.token as string} duelId={Number(params.id)} />
                    )
                }



            </div>

        )
    } else {
        return redirect("/login");
    }
}


export default duelItems;