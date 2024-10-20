"use client";
import { FormEvent, useState } from "react";
import { FormSubmissionStatus } from "../search/interface";
import { LogInResponse } from "@/interfaces/api";

import { useRouter } from "next/navigation";
import LoginWrapper from "./LoginWrapper";

export default function LoginPage(): JSX.Element {
  const [formStatus, setFormStatus] = useState<FormSubmissionStatus>("idle");
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const router = useRouter();

  async function LogInUser(
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
      if (response.ok) {
        const data = (await response.json()) as LogInResponse;
        return data;
      } else {
        throw new Error("Auth reponse not ok");
      }
    } catch (err) {
      throw new Error(`Fetch error: ${err}`);
    }
  }
  function handleLogInSuccess(apiResponse: LogInResponse) {
    localStorage.setItem("accessToken", apiResponse.access_token);
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
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
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
      const result = await LogInUser(credentials);
      handleLogInSuccess(result);
      router.push("/");
    } catch (err) {
      handleLogInFailure(err);
    }
  }
  return (
    <>
      <LoginWrapper handleSubmit={handleSubmit} submissionStatus={formStatus} formType={formType} toggleFormType={toggleFormType}/>
    </>
  );
}

interface LogInFormInputs {
  username: string;
  password: string;
}
