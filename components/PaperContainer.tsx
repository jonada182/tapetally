import Image from "next/image";
import React from "react";
import PaperBackground from "@/public/img/white_paper.jpg";

type Props = {
    children: React.ReactNode;
};

const PaperContainer = (props: Props) => {
    return (
        <div className="relative flex flex-col gap-4 p-8 w-full max-w-md h-full shadow-md shadow-amber-900/50">
            {props.children}
            <Image
                src={PaperBackground}
                alt=""
                fill={true}
                className="object-cover z-0"
            />
            <div className="absolute bg-white opacity-25 w-full h-full top-0 left-0 z-10"></div>
        </div>
    );
};

export default PaperContainer;
