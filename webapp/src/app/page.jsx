import HomeSearchBar  from "./_home_components/HomeSearchBar"
import SpotList from "./_home_components/SpotList";
export default function HomePage() {
  return (
    <>
      <div className="container mx-20">
        <div className="">
          <h1 className="">DÉCOUVRE TON NOUVEAU SPOT DE PLONGÉE PRÉFÉRÉ</h1>
          <p className="">
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
