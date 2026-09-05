import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import DuelMenu from "./DuelMenu";
import Link from "next/link";

const Duel: React.FC<{ duel: duelResponseType, token: string }> = ({ duel, token }) => {

    return <>
        <Card>
            <CardHeader className="flex justify-between flex-row">
                <CardTitle className="font-bold">{duel.title}</CardTitle>
                <DuelMenu token={token} duel={duel} />
            </CardHeader>
            <CardContent>
                {
                    duel.image && <Image src={duel.image} alt="" width={500} height={500} className="rounded-lg w-full h-[220px] object-contain" />
                }
                <CardDescription>{duel.description}</CardDescription>
                <p>
                    <strong>
                        Expire at: {new Date(duel.expire_at).toDateString()}
                    </strong>
                </p>
            </CardContent>
            <CardFooter>
                <Link href={`/duel/items/${duel.id}`}>
                    <Button>Items</Button>
                </Link>
            </CardFooter>
        </Card>

    </>
}

export default Duel;