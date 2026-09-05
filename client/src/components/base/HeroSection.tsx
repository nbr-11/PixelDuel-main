import React from "react"
import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"

const HeroSection: React.FC = () => {
    return <>
        <div className="w-full h-screen flex flex-col justify-center items-center p-4">
            <div>
                <Image
                    src="/bannerLogo.svg"
                    width={300}
                    height={300}
                    alt="banner" />
            </div>

            <div className="text-center">
                <h1 className="text-6xl text-center md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-green-300 to-green-700 text-transparent bg-clip-text" >PixelDuel</h1>
            </div>

            <div className="text-2xl md:text-3xl flex flex-col gap-3 lg:text-4xl font-bold text-center">
                <h2>Let's uncover the top choice, together</h2>
                <Link href={"/login"}>
                    <Button>Get Started</Button>
                </Link>
            </div>

        </div >
    </>
}

export default HeroSection;