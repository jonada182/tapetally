import React, { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import SpotifyLogo from "@/public/img/spotify.png";
import VintageFilter from "./VintageFilter";

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
            className="list-item-container group z-20 flex items-center gap-4"
        >
            <div className="w-4 text-black">{props.index}</div>
            {props.imageUrl && (
                <div className="relative flex aspect-square w-3/12 flex-col items-center justify-end">
                    <Image
                        src={props.imageUrl}
                        alt=""
                        width={100}
                        height={100}
                        loading="eager"
                        priority={true}
                        unoptimized={true}
                        className="absolute left-0 top-0 z-0 h-full w-full object-cover shadow-md shadow-black/30"
                    />
                </div>
            )}
            <h3 className="w-8/12 flex-grow text-lg leading-5 transition-all group-hover:text-amber-800">
                {props.name}
            </h3>
        </Link>
    );
};

export default memo(ListItem);
