import { Trends } from "@/app/types";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";

type Props = {
  accessToken: string | null;
};

export default function useGetTrends({ accessToken }: Props) {
  return useQuery<Trends, AxiosError>({
    queryKey: ["trends"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("Unauthorized"));
      }
      const response = await axios.get<Trends>(`/api/trends`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    },
    enabled: !!accessToken,
  });
}
