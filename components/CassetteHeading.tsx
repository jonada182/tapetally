import Image from "next/image";
import React from "react";
import CassetteImage from "@/public/img/cassette.png";

type Props = {
    text: string;
};

const CassetteHeading = (props: Props) => {
    return (
        <div className="cassette-heading relative flex h-40 justify-center align-middle">
            <h2 className="text-lg md:text-2xl text-center z-20 mt-5 md:mt-4">
                {props.text}
            </h2>
            <Image
                src={CassetteImage}
                alt=""
                width={360}
                height={360}
                className="object-contain object-top absolute w-full h-full top-0 z-0 px-4"
            />
        </div>
    );
};

export default CassetteHeading;
