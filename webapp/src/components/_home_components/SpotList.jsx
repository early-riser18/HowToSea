export default function SpotList() {
  const spot = {
    _id: {
      $oid: "665eaae9d466af1e346117c7",
    },
    author_id: "1",
    title: "Cap gros",
    dateCreated: "13/10/2020",
    description:
      "Zone escarpée, la mise à l'eau peut-être difficile.\ndans la baie à la droite du cap il y a possibilité de s'abriter du courant et de trouver des profondeurs inférieures à 10m de fond avec de beaux poissons tout de même.\nAu bout du cap se situe un plateau à environ 8m de fond suivit du fameux tombant pouvant aller jusqu'à 30m de profondeur, parfait pour un freefall ou simplement pour rester sur le plateau et observer le passage de dorades, sars, mérous et pour les chanceux Dentis et Barracuda.\nDe magnifiques Gorgones ornent le tombant.",
    image: [
      "https://firebasestorage.googleapis.com/v0/b/diving-app-eaabe.appspot.com/o/43.5519%2Fcapgros1.jpg?alt=media&token=81c7b462-b283-45c3-8e7d-59b30ef103de",
      "/spot_img/cap_gros_1.jpg",
      "/spot_img/cap_gros_2.jpg",
    ],
    isPublished: true,
    characteristics: {
      adaptedFor: "all",
      fishy: "true",
      reef: "true",
      shipwreck: "false",
      wall: "false",
      depth: "20 to 39m",
      recommendedAccess: "foot",
    },
    updateTs: "13/10/2020",
    latitude: 43.551923,
    longitude: 7.144933,
    level: "hard",
    parking:
      "Se garer sur l'Avenue André Sella ou au parking de la plage Keller.",
    access_instructions:
      "Descendre la rue en direction de la plage puis se diriger vers la droite jusqu'à l'entrée du sentier du littoral. \nSuivre le sentier du littoral pendant une 20 aine de minute jusqu'au cap gros (1er cap après le passage d'une porte le long d'un mur).",
    address: {
      street: "Avenue André Sella",
      postalCode: "06600",
      city: "Antibes",
      country: "France",
    },
  };
  return (
    <div>
      <h2 className="my-10 font-header text-2xl text-primary md:text-3xl">
        NOS SPOTS À LA UNE
      </h2>
      <div className="mb-20 flex flex-wrap justify-around">
        <SpotMiniature spot={spot} />
        <SpotMiniature spot={spot} />
        <SpotMiniature spot={spot} />
      </div>
    </div>
  );
}

function SpotMiniature({ spot }) {
  return (
    <div className="m-2 w-[380px] cursor-pointer overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-in-out hover:scale-105">
      <img className="h-60 w-full object-cover" src={spot.image[0]} alt="" />
      <div className="flex flex-col p-4">
        <h3>{spot.title}</h3>
        <h4 className="truncate">
          {spot.address.city}, {spot.address.country}
        </h4>
        <div className="inline-flex">
          <h4 className="truncate">0 a 1 m</h4>&nbsp;&nbsp;
          <p className={spot.level}>Facile</p>
        </div>
      </div>
    </div>
  );
}
