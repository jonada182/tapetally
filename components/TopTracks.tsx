import React, { memo } from "react";
import { Track } from "@/app/types";
import Image from "next/image";

type Props = {
    tracks: Track[] | undefined | null;
};

const TopTracks = (props: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full md:w-1/2 flex-grow">
            <h2 className="text-2xl text-center">Top Tracks</h2>
            {!props.tracks && (
                <div className="text-gray-600 text-center font-light">
                    No data available
                </div>
            )}
            <div className="flex flex-wrap gap-4">
                {props?.tracks?.map((track) => {
                    return (
                        <div
                            key={track.id}
                            className="bg-gray-900 text-white flex h-full w-full max-h-32 justify-stretch rounded-lg overflow-hidden"
                        >
                            {track.album.images && track.album.images[0] && (
                                <div className="w-full max-w-[144px] aspect-square flex h-full relative">
                                    <Image
                                        src={track.album.images[0]?.url}
                                        alt={track.name}
                                        fill={true}
                                        loading="lazy"
                                        className="object-cover object-center w-full h-full z-0"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            )}
                            <div className="flex-grow p-8 flex flex-col justify-center items-start gap-2">
                                <h3 className="text-lg z-20">{track.name}</h3>
                                <h4 className="text-sm font-light">
                                    {track.artists[0].name}
                                </h4>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(TopTracks);
