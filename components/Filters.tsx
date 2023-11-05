import { TimeRange } from "@/app/types";
import React, { memo } from "react";

type Props = {
    timeRange: TimeRange;
    handleOnClick: (timeRange: TimeRange) => void;
};

const Filters = (props: Props) => {
    return (
        <div className="grid grid-cols-3 w-full max-w-xs gap-1 mb-8">
            <button
                onClick={() => props.handleOnClick(TimeRange.Short)}
                className={`vintage-btn ${
                    props.timeRange === TimeRange.Short && "active"
                } transition-all font-mono uppercase text-xs bg-vintage-yellow text-white`}
            >
                Last 30 Days
            </button>
            <button
                onClick={() => props.handleOnClick(TimeRange.Medium)}
                className={`vintage-btn ${
                    props.timeRange === TimeRange.Medium && "active"
                } transition-all font-mono uppercase text-xs bg-vintage-orange text-white`}
            >
                Last 6 months
            </button>
            <button
                onClick={() => props.handleOnClick(TimeRange.Long)}
                className={`vintage-btn ${
                    props.timeRange === TimeRange.Long && "active"
                } transition-all font-mono uppercase text-xs bg-vintage-brown text-white`}
            >
                Last Year
            </button>
        </div>
    );
};

export default memo(Filters);
