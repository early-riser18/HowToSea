import { FormEvent } from "react";
import { FormSubmissionStatus } from "../search/interface";

export function LogInForm({
  onSubmit,
  submissionStatus,
}: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  submissionStatus: FormSubmissionStatus;
}): JSX.Element {
  const is_submitting = submissionStatus === "submitting" ? true : false;
  return (
    <>
      <form onSubmit={onSubmit} className="w-full px-10">
        <TextInput
          type="text"
          label="Nom d'utilisateur"
          id="username"
          required
          minLength={5}
          disabled={is_submitting}
        />
        <TextInput
          type="password"
          label="Mot de passe"
          id="password"
          required
          minLength={5}
          disabled={is_submitting}
        />

        <button
          className="mt-2 h-14 rounded-full bg-primary px-8 py-3 text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-[#4c80cd]"
          disabled={is_submitting}
        >
          Se connecter
        </button>
      </form>
    </>
  );
}

export function SignUp({
  onSubmit,
  submissionStatus,
}: {
    onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
    submissionStatus: FormSubmissionStatus;
}): JSX.Element {
  const is_submitting = submissionStatus === "submitting" ? true : false;

  return (
    <>
      <form onSubmit={onSubmit} className="w-full px-10">
        <TextInput
          type="text"
          label="Nom d'utilisateur"
          id="username"
          required
          minLength={5}
          disabled={is_submitting}
        />
        <TextInput
          type="password"
          label="Mot de passe"
          id="password"
          required
          minLength={5}
          disabled={is_submitting}
        />
        <button
          className="mt-2 h-14 rounded-full bg-primary px-8 py-3 text-white transition-all hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-[#4c80cd]"
          disabled={is_submitting}
        >
         Créer un compte    
        </button>
      </form>
    </>
  );
}
const TextInput = ({ type = "text", label, ...props }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="mb-2 block text-sm font-bold text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        className="h-14 w-full rounded-3xl bg-[#f0f6fa] px-4 py-3 text-gray-700 placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-[#d7e3ed]"
        {...props}
      />
    </div>
  );
};
