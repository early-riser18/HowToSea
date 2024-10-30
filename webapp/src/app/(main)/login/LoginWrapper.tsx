import Image from "next/image";
import { LogInForm, SignUp } from "./Forms";
import { FormSubmissionStatus } from "@/app/(main)/search/interface";
import { FormEvent } from "react";
import { Auth0Connection } from "@/interfaces/api";

export default function LoginWrapper({
  formType,
  submissionStatus,
  handleToggleFormType,
  handleSubmit,
  errorCode,
  handleClickOAuth
}: {
  formType: "login" | "signup";
  submissionStatus: FormSubmissionStatus;
  handleToggleFormType: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  errorCode: number | null;
  handleClickOAuth : (c: Auth0Connection) => void;
}): JSX.Element {
  const displayForm = (formType) => {
    return formType === "login" ? (
      <LogInForm errorCode={errorCode} onSubmit={handleSubmit} submissionStatus={submissionStatus} />
    ) : (
      <SignUp errorCode={errorCode} onSubmit={handleSubmit} submissionStatus={submissionStatus} />
    );
  };

  const displayHeader = (formType) => {
    return formType === "login" ? "Se connecter" : "Créer un compte";
  };

  const displayToggle = (formType) => {
    const toggleText = {
      signup: { pre: "Déjà un compte ?", post: "Se connecter" },
      login: { pre: "Pas de compte ?", post: "Créer un compte maintenant" },
    };
    var displayText = formType === "login" ? toggleText.login : toggleText.signup;
    return (
    <div>
      {displayText.pre}
      <button
        onClick={handleToggleFormType}
        className="inline-flex text-primary hover:underline ml-[5px]"
      >
        {displayText.post}
      </button>
    </div>
    );
  };

  return (
    <div className="flex md:h-[85vh] flex-row justify-center">
      <div className="hidden md:inline relative h-64 w-full basis-1/2 overflow-hidden md:h-full">
        <img
          src="/login_seaside.jpg"
          alt="seaside"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex basis-1/2 flex-col items-center py-10">
        <div
          id="formbox"
          className="mb-12 flex w-[350px] sm:w-[450px] flex-col items-center"
        >
          <h1 className="my-4 font-header text-3xl text-slate-800 md:text-4xl">
            {displayHeader(formType)}
          </h1>
          <div id="oauth providers" className="my-2">
            {/* TODO: make button interactive */}
            <button onClick={() => handleClickOAuth("GOOGLE")}>
              <RoundIconWithBackground>
                <Image
                  src="/oauth_google_icon.png"
                  height={25}
                  width={25}
                  alt="google icon"
                />
              </RoundIconWithBackground>
            </button>
          </div>
          <div
            id="divider"
            className="before: m-6 flex w-full items-center px-10"
          >
            <div className="flex-grow border-t border-gray-300" />
            <span className="px-2 font-light text-slate-400">Ou par email</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>
          {displayForm(formType)}
        <div className="mt-5">
            {displayToggle(formType)}
            </div>
        </div>

      </div>
    </div>
  );
}

function RoundIconWithBackground({ children }): JSX.Element {
  return (
    <div className="flex rounded-full bg-[#f0f6fa] p-4 align-middle">
      {children}
    </div>
  );
}
