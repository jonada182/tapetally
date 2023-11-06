import { AxiosError, HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export const handleErrorResponse = (error: AxiosError) => {
    return NextResponse.json(
        { error: error.message, data: error.response?.data },
        {
            status:
                error.response?.status || HttpStatusCode.InternalServerError,
        },
    );
};
