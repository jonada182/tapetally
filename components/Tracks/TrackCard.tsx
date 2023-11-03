import React from "react";
import { Track } from "@/app/types";
import Image from "next/image";

type Props = {
  track: Track;
};

const TrackCard = ({ track }: Props) => {
  return (
    <div className="bg-gray-900 text-white flex h-full w-full max-h-32 justify-stretch rounded-lg overflow-hidden">
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
        <h4 className="text-sm font-light">{track.artists[0].name}</h4>
      </div>
    </div>
  );
};

export default TrackCard;
