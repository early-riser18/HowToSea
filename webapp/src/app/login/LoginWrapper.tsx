import Image from "next/image";
import { LogInForm, SignUp } from "./Forms";
import { FormSubmissionStatus } from "../search/interface";
import { FormEvent } from "react";

export default function LoginWrapper({
  formType,
  submissionStatus,
  toggleFormType,
  handleSubmit
}: {
  formType: "login" | "signup";
  submissionStatus: FormSubmissionStatus;
  toggleFormType: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}): JSX.Element {
  const displayForm = (formType) => {
    return formType === "login" ? (
      <LogInForm onSubmit={handleSubmit} submissionStatus={submissionStatus} />
    ) : (
      <SignUp onSubmit={handleSubmit} submissionStatus={submissionStatus} />
    );
  };

  const displayHeader = (formType) => {
    return formType === "login" ? "Se connecter" : "Créer un compte";
  };

  const displayToggle = (formType) => {
    const ToggleLink = ({ onToggle, children }) => (
      <button
        onClick={onToggle}
        className="inline-flex text-primary hover:underline"
      >
        {children}
      </button>
    );

    return (
      <div>
        {formType === "login" ? (
          <>
            Pas de compte ?{" "}
            <ToggleLink onToggle={toggleFormType}>
              Créer un compte maintenant
            </ToggleLink>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <ToggleLink onToggle={toggleFormType}>Se connecter</ToggleLink>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[90vh] flex-row">
      <div className="relative h-64 w-full basis-1/2 overflow-hidden md:h-full">
        <img
          src="/login_seaside.jpg"
          alt="seaside"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      <div className="flex basis-1/2 flex-col items-center py-10">
        <div
          id="formbox"
          className="mb-12 flex w-[450px] flex-col items-center"
        >
          <h1 className="my-4 font-header text-3xl text-slate-800 md:text-4xl">
            {displayHeader(formType)}
          </h1>
          <div id="oauth providers" className="my-2">
            {/* TODO: make button interactive */}
            <button>
              <RoundIconWithBackground>
                <Image
                  src="/oauth_google_icon.png"
                  height={30}
                  width={30}
                  alt="google icon"
                />
              </RoundIconWithBackground>
            </button>
          </div>
          <div
            id="divider"
            className="before: m-6 flex w-full items-center px-10"
          >
            <div className="flex-grow border-t border-gray-300"/>
            <span className="px-2 font-light text-slate-400">Ou par email</span>
            <div className="flex-grow border-t border-gray-300"/>
          </div>

          {displayForm(formType)}
        </div>
        {displayToggle(formType)}
      </div>
    </div>
  );
}

function RoundIconWithBackground({ children }): JSX.Element {
  return (
    <div className="flex rounded-full bg-[#f0f6fa] p-3 align-middle">
      {children}
    </div>
  );
}
