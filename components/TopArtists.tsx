import React, { memo } from "react";
import { Artist } from "@/app/types";
import Image from "next/image";
import Card from "./Card";

type Props = {
    artists: Artist[] | undefined | null;
};

const TopArtists = (props: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full lg:w-1/2 flex-grow">
            <h2 className="text-2xl text-center">Top Artists</h2>
            {!props.artists && (
                <div className="text-gray-600 text-center font-light">
                    No data available
                </div>
            )}
            <div className="flex flex-col gap-4">
                {props.artists?.map((artist) => {
                    return (
                        <Card
                            key={artist.id}
                            title={artist.name}
                            imageUrl={artist.images && artist.images[0].url}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default memo(TopArtists);
