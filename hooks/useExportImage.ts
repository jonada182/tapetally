import { useMutation } from "react-query";
import axios, { AxiosError } from "axios";
import { useAuthContext } from "@/contexts/AuthContext";
import { useState } from "react";
import { TimeRange } from "@/app/types";

type Props = {
    timeRange: TimeRange
}
export const useExportImage = ({ timeRange }: Props) => {
    const { accessToken } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const { mutate: exportImage, error } = useMutation<void, AxiosError>({
        mutationKey: ["export"],
        mutationFn: async () => {
            if (accessToken) {
                setLoading(true);
                const params = new URLSearchParams();
                params.set("time_range", timeRange)
                params.set("print", "true")
                axios
                    .get(`/api/export?url=${encodeURIComponent(window.location.origin + "?" + params.toString())}`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                        responseType: "blob",
                    })
                    .then((response) => {
                        const imageBlob = new Blob([response.data], {
                            type: "image/jpeg",
                        });
                        const url = window.URL.createObjectURL(imageBlob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "tapetally_trends.jpg";
                        document.body.appendChild(a);
                        a.click();

                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        },
    });

    return {
        exportImage,
        error,
        isLoading: loading,
    };
};
