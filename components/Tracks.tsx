import React, { memo } from "react";
import { Track } from "@/app/types";
import Card from "./shared/Card";
import CassetteHeading from "./CassetteHeading";
import NoData from "./shared/NoData";
import ListItem from "./shared/ListItem";
import PaperContainer from "./shared/PaperContainer";

type Props = {
    tracks: Track[] | undefined | null;
};

const Tracks = (props: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full lg:w-1/2 flex-grow">
            <CassetteHeading text="My Tracks" />
            {!props.tracks && <NoData />}
            {props.tracks && (
                <div className="flex flex-col justify-center items-center gap-4 -mt-20">
                    <Card
                        key={props.tracks[0].id}
                        url={props.tracks[0].external_urls.spotify}
                        title={props.tracks[0].name}
                        imageUrl={
                            props.tracks[0].album.images &&
                            props.tracks[0].album.images[0].url
                        }
                    />
                    <PaperContainer>
                        {props?.tracks?.slice(1).map((track, index) => {
                            return (
                                <ListItem
                                    key={track.id}
                                    url={track.external_urls.spotify}
                                    name={track.name}
                                    imageUrl={
                                        track.album.images &&
                                        track.album.images[0].url
                                    }
                                    index={index + 2}
                                />
                            );
                        })}
                    </PaperContainer>
                    <div id="puppeteer-tracks" className="hidden"></div>
                </div>
            )}
        </div>
    );
};

export default memo(Tracks);
