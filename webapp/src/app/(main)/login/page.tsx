"use client";
import { FormEvent, useState } from "react";
import { FormSubmissionStatus } from "@/app/(main)/search/interface";
import { LogInResponse, Auth0Connection } from "@/interfaces/api";

import { useRouter, useSearchParams } from "next/navigation";
import LoginWrapper from "./LoginWrapper";

export default function LoginPage(): JSX.Element {
  const [formStatus, setFormStatus] = useState<FormSubmissionStatus>("idle");
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const router = useRouter();
async function logInUserOAuth() {
    // should call server for oauth redirect, run redirect in new window etc
  }
  async function logInUserWithPassword(
    loginCredentials: LogInFormInputs,
  ): Promise<LogInResponse> {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginCredentials.username,
        password: loginCredentials.password,
      }),
    };
    const endpoint = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/auth/login`;

    try {
      const response = await fetch(endpoint, options);
      //   if (response.ok) {
      const data = await response.json();
      return { status_code: response.status, body: data } as LogInResponse;
      //   } else {
      // return {status_code: response.status, body: res} as LogInResponse;
      //   }
    } catch (err) {
      throw new Error(`Fetch error: ${err}`);
    }
  }
  function handleLogInSuccess(apiResponse: LogInResponse) {
    if (
      typeof apiResponse.body !== "string" &&
      "access_token" in apiResponse.body
    ) {
      localStorage.setItem("accessToken", apiResponse.body.access_token);
    } else {
      throw new Error("Invalid response body");
    }
    setFormStatus("success");
  }
  function handleLogInFailure(error: Error) {
    // set state failure and run failure behavior
    console.error(error);
    setFormStatus("failure");
  }
  function validateInput() {}

  function toggleFormType() {
    setFormType(formType === "login" ? "signup" : "login");
    setErrorCode(null);
    setFormStatus("idle");
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setFormStatus("submitting");
    // NEED TO VALIDATE INPUT
    try {
      const form = e.target as HTMLFormElement;
      const username = (form.elements.namedItem("username") as HTMLInputElement)
        .value;
      const password = (form.elements.namedItem("password") as HTMLInputElement)
        .value;
      var credentials = {
        username: username,
        password: password,
      } as LogInFormInputs;
    } catch (err) {
      console.error("An error occured while retrieving data");
      // TODO: call display error message function
    }

    try {
      const result = await logInUserWithPassword(credentials);
      if (result.status_code === 200) {
        handleLogInSuccess(result);
        router.push("/");
      } else {
        setErrorCode(result.status_code);
        handleLogInFailure(new Error(`Error code: ${result.status_code}`));
      }
    } catch (err) {
      setErrorCode(500);
      handleLogInFailure(err);
    }
  }

  async function handleClickOAuth(provider : Auth0Connection) {
    const options = {
        method: "GET"
      };
      const endpoint = `${process.env.NEXT_PUBLIC_WEB_SERVER_URL}/auth/oauth/authorize?connection=${provider}&provider=auth0`;
    
      window.location.href = endpoint
      
  }
  return (
    <>
      <LoginWrapper
        handleSubmit={handleSubmit}
        submissionStatus={formStatus}
        formType={formType}
        handleToggleFormType={toggleFormType}
        errorCode={errorCode}
        handleClickOAuth={handleClickOAuth}
      />
    </>
  );
}

interface LogInFormInputs {
  username: string;
  password: string;
}
