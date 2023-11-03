import React from "react";
import { Artist } from "@/app/types";
import Image from "next/image";

type Props = {
  artist: Artist;
};

const ArtistCard = ({ artist }: Props) => {
  return (
    <div className="bg-white text-white p-4 flex flex-col h-1/5 w-full sm:w-1/2 items-stretch justify-center gap-4 relative aspect-square">
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
      <div className="bg-gradient-to-t from-black to-transparent w-full h-full z-10 absolute top-0 left-0 opacity-40"></div>
    </div>
  );
};

export default ArtistCard;
