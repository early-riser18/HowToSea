import { Inter } from "next/font/google";
import "@/app/globals.css";
const inter = Inter({ subsets: ["latin"] });
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

import ServerWidget from "@/components/_home_components/ServerWidget";
import { UserProvider } from "@/stores/userContext";
import AxiosInterceptorClient from "@/components/AxiosInterceptorClient";

config.autoAddCss = false;

export const metadata = {
  title: "How To Sea",
  description:
    "How-To-Sea est l'unique site collaboratif de partage de spot de plongée en France et dans les septs mers du Globe.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <UserProvider>
        <AxiosInterceptorClient>
          <body className={"flex justify-center bg-slate-50" + inter.className}>
            <div className="w-full bg-white 2xl:max-w-screen-2xl">
              <ServerWidget />
              {children}
            </div>
          </body>
        </AxiosInterceptorClient>
      </UserProvider>
    </html>
  );
}
