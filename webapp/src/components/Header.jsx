import Link from "next/link";

export default function Header() {
  return (
    <>
      <div className=" bg-white  xl:px-20 md:px-10 px-1 py-1 shadow-sm mb-10 ">
        <Link
          className=" basis-full flex md:justify-start justify-center items-center"
          href="/"
        >
          <img className="w-10" src="logo.png" />
          <p className="text-primary ml-4 font-bold text-2xl">How To Sea</p>
        </Link>
      </div>
    </>
  );
}
