import React, { memo } from "react";
import { Artist } from "@/app/types";
import Card from "./Card";
import Heading from "./Heading";
import NoData from "./NoData";
import Image from "next/image";
import Link from "next/link";
import ListItem from "./ListItem";
import PaperContainer from "./PaperContainer";

type Props = {
    artists: Artist[] | undefined | null;
};

const Artists = (props: Props) => {
    return (
        <div className="flex flex-col gap-4 w-full lg:w-1/2 flex-grow">
            <Heading text="My Artists" />
            {!props.artists && <NoData />}
            {props.artists && (
                <div className="flex flex-col justify-center items-center gap-4 -mt-20">
                    <Card
                        key={props.artists[0].id}
                        url={props.artists[0].external_urls.spotify}
                        title={props.artists[0].name}
                        imageUrl={
                            props.artists[0].images &&
                            props.artists[0].images[0].url
                        }
                    />
                    <PaperContainer>
                        {props.artists.slice(1)?.map((artist, index) => {
                            return (
                                <ListItem
                                    key={artist.id}
                                    url={artist.external_urls.spotify}
                                    name={artist.name}
                                    imageUrl={
                                        artist.images && artist.images[0].url
                                    }
                                    index={index + 2}
                                />
                            );
                        })}
                    </PaperContainer>
                </div>
            )}
        </div>
    );
};

export default memo(Artists);
