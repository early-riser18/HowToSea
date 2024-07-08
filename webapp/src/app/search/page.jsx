"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchResultsContainer from "./SearchResultsContainer";

export default function SearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryResults, setQueryResults] = useState(null);
  const [queryStatus, setQueryStatus] = useState("loading");
  useEffect(() => {
    console.log("effect called");
    makeSearchQuery().then((r) => {
      //TODO: Validate data before setting query result
      setQueryResults(r);
    });
  }, [searchParams]); // Makes a search query to /location/search. Depends on query params found

  function handleSearch(e) {
    router.push(`${pathname}?lat=43&lng=7&rad=100&level=hard`); // MOCK
  } // update query params, which should trigger search useEffect

  async function makeSearchQuery() {
    const test = `?${searchParams.toString()}`;
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const url = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/location/search${test}`;

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      let a = await response.json();
      setQueryStatus("success");
      return a.data;
    } catch (error) {
      console.error("An error occured while talking to the server.", error);
      setQueryStatus("error");
      return null;
    }
  }

  return (
    <>
      <div className="px-5 md:px-10 xl:px-20">
        <SearchResultsContainer status={queryStatus} data={queryResults} />
      </div>
    </>
  );
}
