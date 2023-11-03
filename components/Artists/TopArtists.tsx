import React from "react";
import { Artist } from "@/app/types";
import ArtistCard from "./ArtistCard";

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
      <div className="flex flex-wrap">
        {props.artists?.map((artist) => {
          return <ArtistCard key={artist.id} artist={artist} />;
        })}
      </div>
    </div>
  );
};

export default TopArtists;
