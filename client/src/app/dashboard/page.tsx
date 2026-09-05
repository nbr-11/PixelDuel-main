import Navbar from "@/components/base/Navbar";
import AddDuel from "@/components/duel/AddDuel";
import React, { useOptimistic } from "react";
import { authOptions, CustomSession, CustomUser } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { getDuels } from "../fetch/getDuels";
import Duel from "@/components/duel/Duel";

const Dashboard: React.FC = async () => {

    const session: CustomSession = await getServerSession(authOptions) as CustomSession;
    const duels: duelResponseType[] = await getDuels(session.user?.token!);


    return <>
        <div className="container mx-auto px-8">
            <Navbar />
            <div className="text-end mt-10">
                <AddDuel user={session.user as CustomUser} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-6  mx-auto">
                {
                    duels.length > 0 && duels.map((duel, index) => <Duel token={session.user?.token as string} key={duel.id} duel={duel} />)
                }
            </div>

        </div>
    </>
}

export default Dashboard;