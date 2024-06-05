import HomeSearchBar from "@/components/_home_components/HomeSearchBar";
import SpotList from "@/components/_home_components/SpotList";

export default function HomePage() {
  return (
    <>
      <div className="px-5 md:px-10 xl:px-20">
        <div className="my-8 text-center">
          <h1 className="my-4 font-header text-3xl font-bold text-primary md:text-4xl">
            DÉCOUVRE TON NOUVEAU SPOT DE PLONGÉE PRÉFÉRÉ
          </h1>
          <p className="font-main text-lg font-medium md:text-xl">
            How-To-Sea est l'unique site collaboratif de partage de spot de
            plongée en France et dans les septs mers du Globe.
          </p>
        </div>
        <HomeSearchBar />
        <SpotList />
      </div>
    </>
  );
}
