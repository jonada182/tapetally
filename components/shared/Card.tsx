import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import SpotifyLogo from "@/public/img/spotify.png";
import VintageFilter from "./VintageFilter";

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
            className="card-container group relative z-10 flex aspect-[4/5] h-full w-full max-w-sm flex-col items-stretch justify-end border-x-[12px] border-t-[12px] border-white bg-black shadow-md shadow-vintage-dark/30"
        >
            {props.imageUrl && (
                <div className="relative flex aspect-square h-4/5 w-full flex-col items-center justify-end overflow-hidden">
                    <Image
                        src={props.imageUrl}
                        alt={props.title}
                        width={512}
                        height={512}
                        loading="eager"
                        priority={true}
                        unoptimized={true}
                        className="absolute z-0 h-full w-full object-cover object-center transition-all duration-300"
                    />
                </div>
            )}
            <div className="relative z-20 flex h-1/5 flex-col items-center justify-center gap-1 bg-white">
                <h3 className="z-20 max-w-sm text-center text-lg leading-4 transition-all group-hover:text-amber-800 md:text-xl md:leading-5 lg:text-2xl lg:leading-6">
                    {props.title}
                </h3>
            </div>
        </Link>
    );
};

export default memo(Card);
