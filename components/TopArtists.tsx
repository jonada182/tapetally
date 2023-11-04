import React, { memo } from "react";
import { Artist } from "@/app/types";
import Image from "next/image";

type Props = {
    artists: Artist[] | undefined | null;
};

const TopArtists = (props: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full md:w-1/2 flex-grow">
            <h2 className="text-2xl text-center">Top Artists</h2>
            {!props.artists && (
                <div className="text-gray-600 text-center font-light">
                    No data available
                </div>
            )}
            <div className="grid grid-flow-row grid-cols-2 gap-4">
                {props.artists?.map((artist) => {
                    return (
                        <div
                            key={artist.id}
                            className="bg-white text-white p-4 flex flex-col w-full items-stretch justify-center gap-4 relative aspect-square rounded-lg overflow-hidden shadow"
                        >
                            <h3 className="text-2xl drop-shadow font-bold z-20 text-center">
                                {artist.name}
                            </h3>
                            {artist.images && artist.images[0] && (
                                <Image
                                    src={artist.images[0]?.url}
                                    alt={artist.name}
                                    fill={true}
                                    loading="lazy"
                                    className="object-cover w-full z-0"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            )}
                            <div className="bg-gradient-to-t from-black to-transparent w-full h-full z-10 absolute top-0 left-0 opacity-50"></div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(TopArtists);
