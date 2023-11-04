import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { TokenResponse } from "@/app/types";

type Props = {
    code: string | null;
};

export default function useGetToken({ code }: Props) {
    return useQuery<TokenResponse, AxiosError>({
        queryFn: async () => {
            if (!code) {
                return Promise.reject(new Error("Invalid code"));
            }
            const response = await axios.post<TokenResponse>("/api/token", {
                code: code,
            });
            return response.data;
        },
        enabled: !!code,
    });
}
