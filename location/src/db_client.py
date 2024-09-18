import os
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util, errors
import json


class MongoDB:
    _instance = None

    def __new__(cls, user: str, pw: str, db_name: str):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
            cls._instance.__initialize(user, pw, db_name)
        return cls._instance

    def __initialize(self, user: str, pw: str, db_name: str) -> None:
        CONNECTION_STRING = f"mongodb+srv://{user}:{pw}@cluster0.ckt20gy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
        self.client = MongoClient(CONNECTION_STRING)
        self.db = self.client[db_name]

    @classmethod
    def from_env(cls, **kwargs):
        return cls(
            user=os.environ["MONGODB_USER"],
            pw=os.environ["MONGODB_PW"],
            db_name=os.environ["MONGODB_DB_NAME"],
            **kwargs,
        )


class SpotDB(MongoDB):
    def __init__(self, **kwargs) -> None:
        self._COLLECTION_ID = "spot"

    @property
    def collection_id(self):
        return self._COLLECTION_ID

    def create_spot(self, payload: dict):
        """Create a new entry in the database. Payload must adhere to the Spot JSON Schema"""
        return self.db[self.collection_id].insert_one(payload)

    def get_spots(self, str_id: list[str]):
        try:
            object_ids = [ObjectId(id) for id in str_id]
        except errors.InvalidId as e:
            raise ValueError(f"Invalid id provided")
        cursor_result = self.db[self.collection_id].find({"_id": {"$in": object_ids}})
        return [json.loads(json_util.dumps(spot)) for spot in cursor_result]

    def search_spots(self, filter: str):
        """Thin wrapper around MongoDB.find()"""
        cursor_result = self.db[self.collection_id].find(filter)

        return [json.loads(json_util.dumps(obj)) for obj in cursor_result]


if __name__ == "__main__":
    pass
