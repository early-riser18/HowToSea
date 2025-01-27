"use client";
import Link from "next/link";
import { useUser } from "@/stores/userContext";

import ProfileMiniature from "./components/ProfileMiniature";

export default function Header(): JSX.Element {
  return (
    <>
      <div className="flex bg-white px-1 py-1 shadow-sm md:px-10 xl:px-20">
        <Link
          className="flex basis-full items-center justify-center md:justify-start"
          href="/"
        >
          <img className="w-10" src="/logo.png" />
          <p className="ml-4 font-header text-2xl font-bold text-primary">
            How To Sea
          </p>
        </Link>

        <ProfileOrLogin />
      </div>
    </>
  );
}

const ProfileOrLogin = function (): JSX.Element {
  const { user } = useUser();

  if (!user || !user.id) {
    return <Link href="/login">Se connecter</Link>;
  }

  return <ProfileMiniature userData={user} />;
};
