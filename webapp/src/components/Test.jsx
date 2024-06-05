export default function Test() {
  return (
    <>
      <div className="border-2 flex ">
        <div className=" h-6 shrink-0 basis-1/2 border-2 border-amber-400"></div>
        <div className=" h-6 grow-0 mx-2 basis-2/3 border-2 border-emerald-400"></div>
        <div className=" grow  basis-2/3 h-6 border-2 border-violet-400"></div>
      </div>
      <p className=" text-primary mx-2 inline-flex border-2">Hello</p>
      <p className=" w-32 block border-2">another</p>
      <span class="relative flex h-3 w-3">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
      </span>
    </>
  );
}
