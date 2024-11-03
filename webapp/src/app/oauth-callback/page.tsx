"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback(): void {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleRequest = async () => {
      const code = searchParams.get("code");
      if (!code) {
        router.push("/");
        return;
      }

      const endpoint = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/auth/oauth/callback?code=${code}&redirect_uri=${process.env.NEXT_PUBLIC_WEB_APP_URL}/oauth-callback`;
      try {
        const response = await fetch(endpoint, { method: "GET" });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        await handleSuccess(response);
      } catch (error) {
        handleFailure(error);
      }
    };

    handleRequest();
  }, [searchParams]);

  async function handleSuccess(response: Response) {
      var data = await response.json();
      console.log(data);
      window.localStorage.setItem("access_token", data["access_token"])
      router.push("/");
  }

  function handleFailure(response: Response) {
    console.warn("An error occured while authenticating")
    router.push("/");
}
}
