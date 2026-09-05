import { DUEL_URL } from "@/lib/apiEndpoints"
import { cache } from "react";


export const getDuels = async (token: string) => {
    const res = await fetch(DUEL_URL, {
        headers: {
            Authorization: token
        },

        next: {
            revalidate: 60 * 60,
            tags: ["dashboard"]
        }
    });

    if (!res?.ok) {
        throw new Error("Failed to fetch data");
    }

    const response = await res.json();

    if (response?.data) {
        return response.data
    }

    return []
}


export const getDuelById = async (id: number) => {
    const res = await fetch(DUEL_URL + `/${id}`, {
        cache: "no-cache",
    });

    if (!res?.ok) {
        throw new Error("Failed to fetch data");
    }

    const response = await res.json();

    if (response?.data) {
        return response.data
    }

    return null;
}