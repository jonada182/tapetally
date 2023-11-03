import React from "react";
import { Track } from "@/app/types";
import TrackCard from "./TrackCard";

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
          return <TrackCard key={track.id} track={track} />;
        })}
      </div>
    </div>
  );
};

export default TopTracks;
