import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import useGetToken from "@/hooks/useGetToken";

type Props = {
    children: React.ReactNode;
};

type AuthContextType = {
    accessToken: string | null;
    isAuthenticated: boolean;
    error: AxiosError | null;
    isLoading: boolean;
    reuthenticate: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthContextProvider = ({ children }: Props) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string | null>(null);
    const {
        data: tokenData,
        error: error,
        isLoading: isLoading,
        refresh: refreshAccessToken,
    } = useGetToken({ code: authCode, refreshToken: refreshToken });

    useEffect(() => {
        const storedAccessToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
    }, []);

    useEffect(() => {
        const code = searchParams.get("code");
        const error = searchParams.get("error");
        if (code && code !== authCode) {
            setAuthCode(code);
            router.replace("/");
        } else if (error) {
            console.log("Error occured:", error);
        }
    }, [router, searchParams]);

    useEffect(() => {
        if (tokenData && tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            localStorage.setItem("access_token", tokenData.access_token);
            if (tokenData.refresh_token) {
                setRefreshToken(tokenData.refresh_token);
                localStorage.setItem("refresh_token", tokenData.refresh_token);
            }
        }

        () => {
            setAuthCode(null);
        };
    }, [tokenData]);

    useEffect(() => {
        if (error) {
            setAccessToken(null);
            setRefreshToken(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
        }
    }, [error]);

    const contextValues: AuthContextType = useMemo(
        () => ({
            accessToken,
            isAuthenticated: !!accessToken,
            error: error,
            isLoading: isLoading,
            reuthenticate: refreshAccessToken,
        }),
        [accessToken, error, isLoading],
    );

    return (
        <AuthContext.Provider value={contextValues}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within a PageProvider");
    }
    return context;
};
