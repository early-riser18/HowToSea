import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className="mb-10 bg-white px-1 py-1 shadow-sm md:px-10 xl:px-20">
        <Link
          className="flex basis-full items-center justify-center md:justify-start"
          href="/"
        >
          <img className="w-10" src="logo.png" />
          <p className="ml-4 font-header text-2xl font-bold text-primary">
            How To Sea
          </p>
        </Link>
      </div>
    </>
  );
}
