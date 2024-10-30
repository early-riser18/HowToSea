'use client';
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthCallback():void {
    const searchParams = useSearchParams();
    const router = useRouter();


    useEffect(() => {

        const code = searchParams.get("code");
        // if (!code){
        //     router.push("/")
        //     return
        // }
        const options = {
            method: "GET",
        }
        const endpoint = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/auth/oauth/callback?${code}`;
        fetch(endpoint, options).then((response) => { console.log(response) }).catch((error) => { console.log(error) });

    }, [searchParams]);
    

}