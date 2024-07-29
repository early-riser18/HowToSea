import { Spot } from "@/interfaces/main";
import SearchResult from "./SearchResult";
import { QueryStatus } from "./interface";

export default function SearchResultsContainer({
  status,
  data,
}: {
  status: QueryStatus;
  data: Spot[];
}) {
  function renderLoading(): JSX.Element {
    return <p>Recherche en cours</p>;
  }

  function renderSuccess(): JSX.Element {
    let content = <></>;

    if (data.length == 0) {
      content = (
        <p>
          Pas de résultat trouvé <br /> Pour obtenir plus de résultat, essayer
          d&apos;ajuster la zone de recherche.
        </p>
      );
    } else {
      content = (
        <div className="flex flex-row flex-wrap gap-4 lg:flex-col lg:gap-0">
          {data.map((result) => (
            <SearchResult key={result._id.$oid} data={result} />
          ))}
        </div>
      );
    }
    return (
      <>
        <h1 className="text-2xl">Resultat de votre recherche</h1>
        {content}
      </>
    );
  }
  function renderError(): JSX.Element {
    return <p>Une erreur s&apos;est produite</p>;
  }

  function renderContent(): JSX.Element {
    switch (status) {
      case "loading":
        return renderLoading();
      case "success":
        return renderSuccess();

      default:
        return renderError();
    }
  }

  return <div className="min-h-[60vh]">{renderContent()}</div>;
}
