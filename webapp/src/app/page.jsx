"use client";
import HomeSearchBar from "@/components/_home_components/HomeSearchBar";
import SpotList from "@/components/_home_components/SpotList";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  function handleSearchRequest({ lat, lng, rad, level }) {
    try {
      const queryString = `?lat=${lat}&lng=${lng}&rad=${rad}&level=${level}`;
      router.push(`/search${queryString}`);
    } catch (error) {
      console.log(error);
      alert("Une erreur s'est produite.");
      return;
    }
  }
  return (
    <>
      <div className="px-5 md:px-10 xl:px-20">
        <div className="my-10 text-center">
          <h1 className="my-4 font-header text-3xl text-primary md:text-4xl">
            DÉCOUVRE TON NOUVEAU SPOT DE PLONGÉE PRÉFÉRÉ
          </h1>
          <p className="font-main text-lg font-medium md:text-xl">
            How-To-Sea est l&apos;unique site collaboratif de partage de spot de
            plongée en France et dans les septs mers du Globe.
          </p>
        </div>
        <APIProvider
          language="fr"
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        >
          <HomeSearchBar handleSubmit={handleSearchRequest} />
        </APIProvider>
        <SpotList />
      </div>
    </>
  );
}
