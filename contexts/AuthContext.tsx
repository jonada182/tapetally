import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AxiosError } from "axios";
import useGetToken from "@/hooks/useGetToken";
import { QueryObserverResult } from "react-query";

type Props = {
    children: React.ReactNode;
};

type AuthContextType = {
    accessToken: string | null;
    isAuthenticated: boolean;
    error: AxiosError | null;
    isLoading: boolean;
    logOut: () => void;
    reuthenticate: () => Promise<QueryObserverResult>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);

export const AuthContextProvider = ({ children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [authCode, setAuthCode] = useState<string | null>(null);
    const {
        data: tokenData,
        error,
        refreshError,
        isLoading,
        refresh,
    } = useGetToken({ code: authCode, refreshToken: refreshToken });

    const logOut = () => {
        setAccessToken(null);
        setRefreshToken(null);
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
    };

    useEffect(() => {
        const storedAccessToken = sessionStorage.getItem("access_token");
        const storedRefreshToken = sessionStorage.getItem("refresh_token");
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
    }, []);

    useEffect(() => {
        let replaceParams = false;
        const newSearchParams = new URLSearchParams(searchParams);
        const code = searchParams.get("code");
        if (code && code !== authCode) {
            setAuthCode(code);
            newSearchParams.delete("code");
            newSearchParams.delete("state");
            replaceParams = true;
        }

        const error = searchParams.get("error");
        if (error) {
            console.log("Error occured:", error);
        }

        const token = searchParams.get("token");
        if (token) {
            setAccessToken(token);
            newSearchParams.delete("token");
            replaceParams = true;
        }

        if (replaceParams) {
            router.replace(pathname + "?" + newSearchParams.toString());
        }
    }, [searchParams]);

    useEffect(() => {
        if (tokenData && tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            sessionStorage.setItem("access_token", tokenData.access_token);
            if (tokenData.refresh_token) {
                setRefreshToken(tokenData.refresh_token);
                sessionStorage.setItem(
                    "refresh_token",
                    tokenData.refresh_token,
                );
            }
        }

        () => {
            setAuthCode(null);
        };
    }, [tokenData]);

    useEffect(() => {
        if (error || refreshError) {
            logOut();
        }
    }, [error, refreshError]);

    const contextValues: AuthContextType = useMemo(
        () => ({
            accessToken,
            isAuthenticated: !!accessToken,
            error: error,
            isLoading: isLoading,
            logOut,
            reuthenticate: refresh,
        }),
        [accessToken, error, isLoading, refresh],
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
