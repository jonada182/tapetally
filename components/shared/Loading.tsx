import React, { memo } from "react";

type Props = {
    message?: string;
};

const Loading = (props: Props) => {
    return (
        <div className="p-4 text-lg text-vintage-dark animate-pulse">
            {props.message ?? "Loading..."}
        </div>
    );
};

export default memo(Loading);
