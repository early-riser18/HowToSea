"use client";
import { useAxiosInterceptor } from "@/api/api";
import { ReactNode } from "react";

// Export the interceptor to be used in the client.
export default function AxiosInterceptorClient({
  children,
}: {
  children: ReactNode;
}) {
  useAxiosInterceptor();

  return <>{children}</>;
}
