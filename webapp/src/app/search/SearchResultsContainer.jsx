import SearchResult from "./SearchResult";

export default function SearchResultsContainer({ status, data }) {
  function renderLoading() {
    return <p>Recherche en cours</p>;
  }
  function renderSuccess() {
    let content = <></>;

    if (data.length == 0) {
      content = <p>Pas de résultat trouvé</p>;
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
  function renderError() {
    return <p>Une erreur s'est produite</p>;
  }

  function renderContent() {
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
