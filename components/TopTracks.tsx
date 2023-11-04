import React, { memo } from "react";
import { Track } from "@/app/types";
import Image from "next/image";
import Card from "./Card";

type Props = {
    tracks: Track[] | undefined | null;
};

const TopTracks = (props: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full lg:w-1/2 flex-grow">
            <h2 className="text-2xl text-center">Top Tracks</h2>
            {!props.tracks && (
                <div className="text-gray-600 text-center font-light">
                    No data available
                </div>
            )}
            <div className="flex flex-col gap-4">
                {props?.tracks?.map((track) => {
                    return (
                        <Card
                            key={track.id}
                            title={track.name}
                            description={track.artists[0].name}
                            imageUrl={
                                track.album.images && track.album.images[0].url
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default memo(TopTracks);
