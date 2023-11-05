import { TimeRange, Trends } from "@/app/types";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

type Props = {
    accessToken: string | null;
    timeRange: TimeRange;
};

export default function useGetTrends({ accessToken, timeRange }: Props) {
    return useQuery<Trends, AxiosError>({
        queryKey: ["trends", timeRange],
        queryFn: async () => {
            if (!accessToken) {
                return Promise.reject(new Error("Unauthorized"));
            }
            const response = await axios.get<Trends>(
                `/api/trends/${timeRange}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            return response.data;
        },
        enabled: !!accessToken,
    });
}
