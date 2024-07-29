"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
export default function ServerWidget() {
  const [isServerUp, setIsServerUp] = useState<boolean>(false);
  const [isRequestingServerUp, setIsRequestingServerUp] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchServerStatus() {
      const status = await checkServerStatus();
      setIsServerUp(status);
    }
    fetchServerStatus();
  }, []);

  async function checkServerStatus(): Promise<boolean> {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/location/`,
      );
      return res.ok;
    } catch (error) {
      return false;
    }
  }

  async function requestServerUp(): Promise<void> {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ desired_count: 1 }),
    };

    fetch(`${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/servers`, options)
      .then((r) => console.log(r.json()))
      .catch((e) => console.info("Unable to fetch service /location"));
  }

  async function handleOnClick(): Promise<void> {
    // Request server to turn on
    setIsRequestingServerUp(true);
    requestServerUp();
    // poll server for 90s
    for (let i = 0; i < 24; i++) {
      const isServiceUp = await checkServerStatus();
      console.log("Checking server status...");
      if (isServiceUp) {
        setIsServerUp(true);
        window.location.reload();
        break;
      }
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      await delay(5000);
    }
    setIsRequestingServerUp(false);
  }

  function getNextServerDownTime() {
    const u = [0, 15, 30, 45];
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);

    const hours = String(now.getHours()).padStart(2, "0");
    let minutes = now.getMinutes();

    let i = 0;
    while (minutes / u[i] > 1) {
      i++;
    }
    const minuteStr = String(u[i - 1]).padStart(2, "0");

    return `${hours}:${minuteStr}`;
  }

  var btnMsg = isRequestingServerUp
    ? "Turning on servers..."
    : "Turn on servers";
  var content = (
    <p className="text-white">
      Servers running until {getNextServerDownTime()}
    </p>
  );
  if (!isServerUp) {
    content = (
      <>
        <p className="text-white">
          Welcome! To enjoy the full experience of my portfolio project, please
          first turn on the servers. This will take about 60 seconds.{" "}
        </p>

        <button
          className="my-0.5 ml-2 flex shrink-0 items-center rounded-md bg-white px-4 py-2 hover:bg-[#f3f3f3]"
          disabled={isRequestingServerUp}
          onClick={handleOnClick}
        >
          {isRequestingServerUp ? (
            <ClipLoader className="mr-1.5" speedMultiplier={0.7} size={20} />
          ) : null}
          {btnMsg}
        </button>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center bg-[#f9824c] px-5 py-0.5 md:flex-row md:justify-between md:px-10 xl:px-20">
      {content}
    </div>
  );
}
