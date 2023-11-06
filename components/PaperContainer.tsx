import Image from "next/image";
import React from "react";
import PaperBackground from "@/public/img/paper.jpg";

type Props = {
    children: React.ReactNode;
};

const PaperContainer = (props: Props) => {
    return (
        <div className="relative flex flex-col gap-4 px-4 pb-8 pt-16 w-full max-w-md h-full shadow-md shadow-vintage-dark/50 -mt-12 z-0">
            {props.children}
            <Image
                src={PaperBackground}
                alt=""
                width={500}
                height={500}
                className="object-cover object-center absolute top-0 left-0 w-full h-full z-0"
            />
            <div className="absolute bg-white opacity-25 w-full h-full top-0 left-0 z-10"></div>
        </div>
    );
};

export default PaperContainer;
