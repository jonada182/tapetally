import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import SpotifyLogo from "@/public/img/spotify.png";

type Props = {
    url: string;
    index: number;
    imageUrl?: string;
    name: string;
};

const ListItem = (props: Props) => {
    return (
        <Link
            href={props.url}
            target="_blank"
            className="z-20 flex gap-4 items-center group"
        >
            <div className="text-black w-4">{props.index}</div>
            {props.imageUrl && (
                <div className="relative flex flex-col items-center justify-end w-3/12 aspect-square">
                    <Image
                        src={props.imageUrl}
                        alt=""
                        width={100}
                        height={100}
                        className="object-cover w-full h-full absolute top-0 left-0 z-0 shadow-md shadow-black/30 group-hover:grayscale"
                    />
                    <Image
                        src={SpotifyLogo}
                        alt="Spotify"
                        width={24}
                        height={24}
                        className="z-20 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-y-1/2 duration-300"
                    />
                    <div className="absolute transition-all duration-300 bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent group-hover:opacity-75 opacity-0"></div>
                </div>
            )}
            <h3 className="transition-all flex-grow text-lg leading-5 group-hover:text-amber-800 w-8/12">
                {props.name}
            </h3>
        </Link>
    );
};

export default memo(ListItem);
