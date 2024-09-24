from location.src.db_client import SpotDB
from bson import json_util

mongo_conn = SpotDB.from_env()


def create_db():
    with open("./schema/spot.bson") as f:
        schema_raw = f.read()
    if input("are you sure you want to drop? (y)") == "y":
        mongo_conn.db.drop_collection("spot")
        mongo_conn.db.create_collection("spot", validator=json_util.loads(schema_raw))
        print("dropped")
    else:
        print("cancelled")


mongo_conn.create_spot(
    {
        "author_id": "2",
        "title": "Tour Caldanu",
        "dateCreated": "07/01/2021",
        "description": "Dalle de granite sur le bord de l'eau qui facilite la mise à l'eau. Spot peu profond mais plien de vie. Il faut faire attention au niveau de la pointe il peux y avoir du courant. Évitez ce spot par grand vent si vous êtes novice. Il est agréable de avril à septembre cependant il y a une forte affluence l'été. Il faudra donc privilégier le soir ou le matin.",
        "image": [],
        "isPublished": True,
        "characteristics": {
            "adaptedFor": "snorkeling",
            "fishy": "true",
            "reef": "false",
            "shipwreck": "false",
            "wall": "false",
            "depth": "0 to 9m",
            "recommendedAccess": "foot",
        },
        "updateTs": "07/01/2021",
        "latitude": 42.582977,
        "longitude": 8.798826,
        "level": "medium",
        "parking": "Vous pouvez vous garer directement à la tour.",
        "access_instructions": "Arrivée sur la tour garer vous sur la gauche si possible. La mise a l'eau est possible partout sur le spot mais plus simple sur la gauche ou vous verrez un semblant de plage.",
        "address": {
            "street": "Caldano",
            "postalCode": "20260",
            "city": "Lumio",
            "country": "France",
        },
    }
)
