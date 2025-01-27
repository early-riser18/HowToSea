import Image from "next/image";

interface UserData {
  img?: string;
  name?: string;
}

export default function ProfileMiniature({
  userData,
}: {
  userData: UserData;
}): JSX.Element {
  const resolveImgSrc = (): string =>
    userData.img || "/no_profile_picture_icon.png";

  return (
    <div className="flex items-center space-x-3">
      <div className="relative h-10 w-10 overflow-hidden rounded-full">
        <Image
          src={resolveImgSrc()}
          alt={`${userData.name || "User"}'s profile picture`}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <p className="text-sm font-medium">{userData.name || "undefined"}</p>
    </div>
  );
}
