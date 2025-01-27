import Link from "next/link";

export default function Footer({ user }: { user?: any }): JSX.Element {
  return (
    <footer className="flex justify-center border-b border-t border-neutral-200 bg-blue-50 p-4 leading-loose text-zinc-700">
      <div className="flex w-full max-w-[1300px] flex-wrap justify-between">
        <ul className="p-4">
          <Link href="/">
            <li className="hover:underline">Accueil</li>
          </Link>
          <Link href="/add-spot">
            <li className="hover:underline">Ajouter un spot</li>
          </Link>
          {user ? (
            <Link href="/profile">
              <li className="hover:underline">Mon Profil</li>
            </Link>
          ) : (
            <Link href="/sign-in">
              <li className="hover:underline">Se connecter</li>
            </Link>
          )}
          <li className="hover:underline">Nous contacter</li>
        </ul>

        <ul className="p-4">
          <li className="hover:underline">Conditions d&apos;utilisation</li>
          <li className="hover:underline">Politique de confidentialité</li>
          <li className="hover:underline">Reporter un problème</li>
          <li className="hover:underline">Changer de langue</li>
        </ul>

        <ul className="flex flex-col p-4">
          <li>©2024 How-To-Sea</li>
          <li>Tous droits réservés</li>
          <li>
            <img className="ml-10 mt-1 w-16" src={"/logo.png"} alt="Logo" />
          </li>
        </ul>
      </div>
    </footer>
  );
}
