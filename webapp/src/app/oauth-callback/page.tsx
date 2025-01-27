"use client";
import { useUser } from "@/stores/userContext";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback(): void {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTokens } = useUser();

  useEffect(() => {
    const handleRequest = async () => {
      const code = searchParams.get("code");
      if (!code) {
        throw new Error("Invalid parameters provided.");
      }

      const endpoint = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/auth/oauth/callback?code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_WEB_APP_URL}/oauth-callback`;
      try {
        const response = await fetch(endpoint, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        await handleSuccess(response);
      } catch (error) {
        throw new Error(error);
      }
    };

    try {
      handleRequest();
    } catch (e) {
      console.log(e);
      router.push("/");
    }
  }, [searchParams]);

  async function handleSuccess(response: Response) {
    var data = await response.json();
    console.log("OAuth Token received:", data);
    const bearerTokens = {
      access: data["access_token"],
      refresh: null,
    };

    localStorage.setItem("bearerTokens", JSON.stringify(bearerTokens));
    setTokens(bearerTokens);
    router.push("/");
  }
}
