"use client";

import { useEffect, useState } from "react";

export default function SpotList() {
  const [spotsData, setSpotsData] = useState([]);
  useEffect(() => {
    console.log("i am called");
    const options = {
      method: "GET", // HTTP method
      headers: {
        "Content-Type": "application/json", // Specify the content type
      },
    };
    const url = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/location/rec`;
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((body) => {
        console.log(body);
        setSpotsData(body.data);
      })
      .catch((error) => {
        console.error("An error occured while talking to the server.", error);
      });
  }, []);
  return (
    <div>
      <h2 className="my-10 font-header text-2xl text-primary md:text-3xl">
        NOS SPOTS À LA UNE
      </h2>
      <div className="mb-20 flex flex-wrap justify-around">
        {spotsData.map((spot) => (
          <SpotMiniature spot={spot} />
        ))}
      </div>
    </div>
  );
}

function SpotMiniature({ spot }) {
  return (
    <div className="m-2 w-[380px] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-105">
      <img className="h-60 w-full object-cover" src={spot.image[0]} alt="" />
      <div className="flex flex-col p-4">
        <h3>{spot.title}</h3>
        <h4 className="truncate">
          {spot.address.city}, {spot.address.country}
        </h4>
        <div className="inline-flex">
          <h4 className="truncate">0 a 1 m</h4>&nbsp;&nbsp;
          <p className={spot.level}>Facile</p>
        </div>
      </div>
    </div>
  );
}
