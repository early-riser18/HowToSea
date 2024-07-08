import Link from "next/link";

export default function SearchResult({ data }) {
  function mapLevel(level) {
    switch (level) {
      case "easy":
        return "facile";
      case "medium":
        return "intermédiaire";
      case "hard":
        return "Avancé";
    }
  }
  return (
    <>
      <Link
        href={`/spot/${data._id.$oid}`}
        className="flex min-w-[250px] shrink grow basis-1/3 flex-col lg:my-5 lg:flex-row"
      >
        <div className="flex h-full max-h-[250px] shrink-0 justify-center overflow-hidden rounded-lg lg:max-h-[200px] lg:w-[300px]">
          <img className="object-cover" alt={data.title} src={data.image[0]} />
        </div>
        <div className="my-3 flex h-[80px] flex-col justify-between overflow-hidden lg:mx-3 lg:my-0 lg:h-auto">
          <div>
            <div className="flex w-full justify-between">
              <p className="text-lg">{data.title}</p>
              <p>4.8 X</p>
            </div>
            <p className="font-light text-[#6A6A6A]">
              {data.address.city}, {data.address.country}
            </p>

            <p className="w-100 my-2 hidden font-light text-[#6A6A6A] lg:line-clamp-3">
              {data.description}
            </p>
          </div>
          <p className="capitalize">{mapLevel(data.level)}, Keywords</p>
        </div>
      </Link>
      <hr className="last:hidden" />
    </>
  );
}
