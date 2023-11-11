import { TimeRange } from "@/app/types";
import React, { memo, useEffect, useRef, useState } from "react";

type Props = {
    timeRange: TimeRange;
    // eslint-disable-next-line no-unused-vars
    handleOnClick: (timeRange: TimeRange) => void;
};

const timeRangeLabels = {
    [TimeRange.Short]: "last 30 days",
    [TimeRange.Medium]: "last 6 months",
    [TimeRange.Long]: "last year",
};

const Filters = (props: Props) => {
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current?.contains(event.target)
            ) {
                setDropdownIsOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    return (
        <div className="w-full mb-8 font-mono">
            <div id="filters-container" className="flex gap-2 justify-center">
                <div className="filters-label">From your</div>
                <div className="relative" ref={dropdownRef}>
                    <div
                        onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                        className="filters-current font-bold underline cursor-pointer"
                    >
                        {timeRangeLabels[props.timeRange]}
                    </div>
                    <div
                        className={`${
                            dropdownIsOpen ? "flex" : "hidden"
                        } absolute flex-col gap-1 justify-stretch text-sm w-max z-50 top-8 left-0 p-4 bg-vintage-dark text-vintage-white rounded shadow shadow-black/50 before:w-2 before:h-2 before:bg-vintage-dark before:absolute before:-top-1 before:left-1/2 before:-ml-1 before:rotate-45`}
                    >
                        {Object.entries(timeRangeLabels).map(([key, value]) => {
                            return (
                                <div
                                    key={key}
                                    className={`${
                                        key == props.timeRange
                                            ? "font-bold underline"
                                            : "font-light no-underline"
                                    } transition-all cursor-pointer hover:text-vintage-yellow`}
                                    onClick={(e) => {
                                        setDropdownIsOpen(false);
                                        props.handleOnClick(key as TimeRange);
                                        e.preventDefault();
                                    }}
                                >
                                    {value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filters);
