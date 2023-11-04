import Image from "next/image";
import React, { memo } from "react";
import { Permanent_Marker } from "next/font/google";

type Props = {
    title: string;
    description?: string;
    imageUrl?: string;
};

const titleFont = Permanent_Marker({ subsets: ["latin"], weight: "400" });

const Card = (props: Props) => {
    return (
        <div className="bg-black flex flex-col w-full items-stretch justify-end relative aspect-video shadow overflow-hidden rounded-xl">
            {props.imageUrl && (
                <Image
                    src={props.imageUrl}
                    alt={props.title}
                    fill={true}
                    loading="lazy"
                    className="object-cover object-center z-0"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            )}
            <div className="flex flex-col items-center justify-start relative h-40 p-4 z-20">
                <h3
                    className={`flex flex-col items-center justify-center max-w-sm h-12 lg:h-16 overflow-hidden text-base md:text-lg lg:text-2xl z-20 text-center text-black ${titleFont.className}`}
                >
                    {props.title}
                </h3>
                {props.description && (
                    <h4 className="h-6 mt-4 px-4 flex flex-col justify-center overflow-hidden text-sm z-20 text-center bg-yellow-950 text-amber-100 uppercase rounded">
                        {props.description}
                    </h4>
                )}
                <Image
                    src="/cassette.png"
                    alt=""
                    fill={true}
                    sizes="100vw"
                    className="object-cover object-top absolute bottom-0 px-4"
                />
            </div>
            <div className="bg-gradient-to-t from-black to-transparent w-full h-1/2 z-10 absolute bottom-0 left-0 opacity-75"></div>
        </div>
    );
};

export default memo(Card);
