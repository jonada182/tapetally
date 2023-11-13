import { TimeRange, Trends } from "@/app/types";
import { useAuthContext } from "@/contexts/AuthContext";
import axios, { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";

type Props = {
    timeRange: TimeRange;
};

export default function useGetTrends({ timeRange }: Props) {
    const { accessToken, reuthenticate } = useAuthContext();
    const queryClient = useQueryClient();
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
            // Delay response by 5 seconds
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            return response.data;
        },
        onError: (err) => {
            if (err && err?.response?.status == 401) {
                reuthenticate().then((response) => {
                    if (response.isSuccess) {
                        queryClient.refetchQueries(["trends", timeRange]);
                    }
                });
            }
        },
        enabled: !!accessToken,
    });
}
