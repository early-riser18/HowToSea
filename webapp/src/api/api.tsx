import { useUser } from "@/stores/userContext";
import assert from "assert";
import Axios from "axios";
import { useRouter } from "next/navigation";

assert(
  process.env.NEXT_PUBLIC_WEB_SERVER_URL,
  "NEXT_PUBLIC_WEB_SERVER_URL not set",
);

export const api = Axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}`,
  headers: { "Content-Type": "application/json" },
});

export const useAxiosInterceptor = () => {
  const router = useRouter();
  const { setTokens } = useUser();
  /** Intercepts Requests. Attaches access token to header and continues the request. */
  api.interceptors.request.use(
    (config) => {
      if (localStorage.getItem("bearerTokens")) {
        const bearerTokens = JSON.parse(localStorage.getItem("bearerTokens"));
        config.headers.Authorization = `Bearer ${bearerTokens.access}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.status === 401) {
            console.log("AXIOS GOT 401")
        // TODO: First attempt to refresh token if possible 
        localStorage.removeItem("bearerTokens");
        setTokens(null);
        router.push("/login");
      }
    },
  );
};
