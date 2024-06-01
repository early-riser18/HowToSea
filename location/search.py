ALLOWED_SEARCH_PARAMS = ["lat", "lng", "rad", "level"]
from .db_client import SpotDB
from bson.objectid import ObjectId
import logging

def translate_search_query_for_mongo_db(query_params: dict):
    """Takes the query provided by the front end and makes it suitable as a db query (either through SQL or else)"""

    #Validate arguments
    if None in [query_params[i] for i in query_params]:
        raise ValueError("Missing required search argument.")
    
    #Create acceptable distance

    #Filter for level

def search_with_geospatial(query_params):
    #Validate arguments
    if None in [query_params[i] for i in query_params]:
        raise ValueError("Missing required search argument.")
    
    """
    Step 0 - filter out objects based on other attributes. 
    Step 1 - get all objects (id, lat, lng)
    Step 2 - calculate euclidean distance
    step 3 - keep only ids with good distance 
    step 4 - call the DB to get full info for those ids 
    """

    keyword_query = {"level": query_params["level"]}
    db_client = SpotDB.from_env()
    spots_ObjectsId_filtered_by_keyword =  [ObjectId(item['_id']['$oid']) for item in db_client.search_spots(keyword_query, True)]
    spots_filtered_by_keyword = [spot for spot in db_client.search_spots({"_id": {"$in": spots_ObjectsId_filtered_by_keyword} }, id_only=False)]
    print(spots_filtered_by_keyword[0])
    spots_within_distance = []
    for spot in spots_filtered_by_keyword:
        
        print(calculate_euclidean_distance(float(spot["latitude"]), float(spot["longitude"]), 42, 6))


def calculate_euclidean_distance(lat_x: float, lng_x: float, lat_y: float, lng_y: float) -> float:
    return  (lat_x - lat_y) / (lng_x - lng_y)
    


#TODO
#TEST normal loop vs using numpy 


if __name__ == "__main__":
    ref = (10, 15)
    test1 = (3, 7)
    test2 = (12, 8)

    
    print(calculate_euclidean_distance(ref[0], ref[1], test1[0], test1[1]))
    print(calculate_euclidean_distance(ref[0], ref[1], test2[0], test2[1]))

    test_query_params = {
        "lat": ref[0],
        "lng": ref[1],
        "rad": 10,
        "level": "hard"
    }
    print(search_with_geospatial(test_query_params))