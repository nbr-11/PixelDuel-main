import Credentials from "next-auth/providers/credentials"
import { AuthOptions, ISODateString } from "next-auth"
import { JWT } from "next-auth/jwt"
import axios from "axios"
import { LOGIN_URL } from "@/lib/apiEndpoints"


export type CustomUser = {
    id?: string | null,
    name?: string | null,
    email?: string | null,
    token?: string | null
}

export type CustomSession = {
    user?: CustomUser,
    expires: ISODateString
}


export const authOptions: AuthOptions = {

    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials, req) {

                const { data } = await axios.post(LOGIN_URL, credentials)

                const user = data?.data;

                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, user, token }: { session: CustomSession, user: CustomUser, token: JWT }) {

            session.user = token?.user as CustomUser;
            return session;
        },

        async jwt({ token, user }: { token: JWT, user: CustomUser | null }) {

            if (user) {
                token.user = user;
            }

            return token;
        }
    },
    secret: process.env.NEXTAUTH_SECRET as string,

}


