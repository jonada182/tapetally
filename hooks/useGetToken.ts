import { useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { UserAccessToken } from "@/app/types";

type Props = {
    code?: string | null;
    refreshToken?: string | null;
};

export default function useGetToken({ code, refreshToken }: Props) {
    const queryClient = useQueryClient();
    const {
        data: accessTokenData,
        error: accessTokenError,
        isLoading: accessTokenLoading,
    } = useQuery<UserAccessToken, AxiosError>({
        queryKey: ["token"],
        queryFn: async () => {
            if (!code) return Promise.reject(new Error("bad request"));

            const response = await axios.post<UserAccessToken>("/api/token", {
                code: code,
            });
            return response.data;
        },
        enabled: !!code,
    });

    const {
        refetch: refresh,
        data: refreshTokenData,
        error: refreshTokenError,
        isLoading: refreshTokenLoading,
    } = useQuery<UserAccessToken, AxiosError>({
        queryFn: async () => {
            if (!refreshToken) return Promise.reject(new Error("bad request"));

            const response = await axios.get<UserAccessToken>(
                `/api/token?access_token=${refreshToken}`,
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.resetQueries(["token"]);
        },
        enabled: false,
    });

    return {
        data: refreshTokenData ? refreshTokenData : accessTokenData,
        error: accessTokenError || refreshTokenError,
        isLoading: accessTokenLoading || refreshTokenLoading,
        refresh,
    };
}
