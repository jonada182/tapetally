import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import SpotifyLogo from "@/public/img/spotify.png";

type Props = {
    title: string;
    imageUrl?: string;
    url: string;
};

const Card = (props: Props) => {
    return (
        <Link
            href={props.url}
            target="_blank"
            className="bg-black group flex flex-col w-full max-w-sm h-full aspect-[4/5] items-stretch justify-end relative shadow-md shadow-amber-900/50 border-x-[12px] border-t-[12px] border-white"
        >
            {props.imageUrl && (
                <div className="relative flex flex-col items-center justify-center w-full h-4/5 aspect-square">
                    <Image
                        src={props.imageUrl}
                        alt={props.title}
                        width={512}
                        height={512}
                        loading="lazy"
                        className="w-full h-full absolute object-cover object-center z-0"
                    />
                    <Image
                        src={SpotifyLogo}
                        alt="Spotify"
                        width={36}
                        height={36}
                        className="z-20 opacity-0 group-hover:opacity-100 transition-all"
                    />
                    <div className="absolute transition-all top-0 left-0 w-full h-full bg-black group-hover:opacity-50 opacity-0"></div>
                </div>
            )}
            <div className="bg-gradient-radial from-transparent from-70% to-black/75 w-full h-4/5 z-10 absolute top-0 left-0 opacity-25"></div>
            <div className="bg-amber-800 w-full h-full z-10 absolute bottom-0 left-0 opacity-20"></div>
            <div className="flex flex-col gap-1 items-center justify-center relative h-1/5 z-20 bg-white">
                <h3 className="max-w-sm text-lg md:text-xl md:leading-5 lg:text-2xl lg:leading-6 leading-4 z-20 text-black text-center">
                    {props.title}
                </h3>
            </div>
        </Link>
    );
};

export default memo(Card);
