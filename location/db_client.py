import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util
from dataclasses import dataclass, field
import json


class MongoDB:

    def __init__(self, user: str, pw: str, db_name: str) -> None:
        CONNECTION_STRING = f"mongodb+srv://{user}:{pw}@cluster0.ckt20gy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        self.client = MongoClient(CONNECTION_STRING)
        self.database = self.client[db_name]

    @classmethod
    def from_env(cls, **kwargs):
        return cls(
            user=os.environ["MONGODB_USER"], pw=os.environ["MONGODB_PW"], **kwargs
        )


class SpotDB(MongoDB):
    def __init__(self, user: str, pw: str) -> None:
        super().__init__(user, pw, "location")

    def create_spot(self, payload: dict):
        """Create a new entry in the database. Payload must adhere to the Spot JSON Schema"""
        return self.database["test"].insert_one(payload)

    def get_spots(self, str_id: list[str]):
        object_ids = [ObjectId(id) for id in str_id]
        cursor_result = self.database["test"].find({"_id": {"$in": object_ids}})

        return [json.loads(json_util.dumps(spot)) for spot in cursor_result]

    def search_spots(self, filter, id_only: bool = False):
        """TBD if filter is in MongoDB format or in an abstracted format."""
        cursor_result = self.database["test"].find(filter, {"_id": int(id_only)})

        return [json.loads(json_util.dumps(obj)) for obj in cursor_result]

test_payload = {
    "author_id": "tbd",
    "title": "Spot 5",
    "dateCreated": "tbd",
    "description": "lorem Ipsum. la droite du cap il y a possibilité de s'abriter du courant et de trouver des profondeurs inférieures à 10m de fond avec de beaux poissons tout de même.Au bout du cap se situe un plateau à environ 8m de fond suivit du fameux tombant pouvant aller jusqu'à 30m de profondeur, parfait pour un freefall ou simplement pour rester sur le plateau et observer le passage de dorades, sars, mérous et pour les chanceux Dentis et Barracuda. De magnifiques Gorgones ornent le tombant.",
    "characteristics": {
        "suitableFor": "all",
        "fishy": False,
        "reef": True,
        "shipwreck": False,
        "wall": True,
    },
    "image": [],
    "isPublished": False,
    "updateTs": "tbd",
    "lastUpdated": "11/10/2020",
    "latitude": "41.621923",
    "longitude": "7.114933",
    "level": "hard",
    "parking": "Se garer sur l'Avenue André Sella ou au parking de la plage Keller.",
    "address": {
        "city": "Marseille",
        "street": "Avenue André Sella",
        "postalCode": "06600",
        "country": "France",
    },
    "totalRating": 0,
}

# col["test"].insert_one(test_payload)


# def retrieve_from_db(_id: str) -> str:
#     col = get_database()
#     # return "worked so far"
#     query_res = col["test"].find_one({"_id": ObjectId(str(_id))})
#     query_res_as_obj = json_util.dumps(query_res)
#     import json
#     return json.loads(query_res_as_obj)

if __name__ == "__main__":
    db = SpotDB.from_env()
    print(db.client)
    print(db.get_spots(["66544712a4efc40df8ac4e08", "6654888f4b9811626fc5912a"]))
    # retrieve_from_db("66544712a4efc40df8ac4e08")
