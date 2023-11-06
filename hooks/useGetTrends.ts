import { TimeRange, Trends } from "@/app/types";
import { useAuthContext } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

type Props = {
    timeRange: TimeRange;
};

export default function useGetTrends({ timeRange }: Props) {
    const { accessToken, reuthenticate } = useAuthContext();
    return useQuery<Trends, AxiosError>({
        queryKey: ["trends", timeRange],
        queryFn: async () => {
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
        onError: (err) => {
            if (err && err?.response?.status == 401) {
                reuthenticate();
            }
        },
        enabled: !!accessToken,
    });
}
