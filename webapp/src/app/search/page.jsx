"use client";
import { useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchResultsContainer from "./SearchResultsContainer";
import SearchBar from "./SearchBar";

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryStatus, setQueryStatus] = useState("loading");
  const [queryResults, setQueryResults] = useState(null);

  useEffect(() => {
    fetchLocation(searchParams.toString())
      .then((r) => {
        setQueryResults(r);
      })
      .catch((e) => {
        setQueryStatus("error");
      });
  }, [searchParams]); // Makes a search query to /location/search. Depends on query params found

  function handleSearchRequest({ lat, lng, rad, level }) {
    try {
      const queryString = `?lat=${lat}&lng=${lng}&rad=${rad}&level=${level}`;
      router.push(`${pathname}${queryString}`);
    } catch (error) {
      alert("Une erreur s'est produite.");
      return;
    }
  }

  async function fetchLocation(searchParamsStr) {
    setQueryStatus("loading");
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const url = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/location/search?${searchParamsStr}`;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      let a = await response.json();

      if (!validateQueryResult(a.data)) {
        throw new Error("Invalid result: " + a.data);
      }

      setQueryStatus("success");
      return a.data;
    } catch (error) {
      console.error("An error occured while talking to the server.", error);
      setQueryStatus("error");
      return null;
    }
  }
  function validateQueryResult(resultObj) {
    // Can be expanded further.
    if (!Array.isArray(resultObj)) {
      return false;
    }
    return true;
  }
  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <div className="px-5 md:px-10 xl:px-20">
          <SearchBar handleSubmit={handleSearchRequest} />
          <SearchResultsContainer status={queryStatus} data={queryResults} />
        </div>
      </APIProvider>
    </>
  );
}
