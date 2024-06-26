from src.db_client import SpotDB
from bson.objectid import ObjectId
import logging
import math

RADIUS_TO_COORD_FACTOR = 100
DB_CLIENT = SpotDB.from_env()


### MAIN
def search_with_geospatial(lat: float, lng: float, rad: int, keywords: dict):
    """
    Currently works for single values level.
    """
    keyword_query = {"level": {"$in": keywords["level"]}}
    spots_filtered_by_keyword = [spot for spot in DB_CLIENT.search_spots(keyword_query)]

    spots_within_distance = []
    for spot in spots_filtered_by_keyword:
        if is_spot_within_distance(spot=spot, lat=lat, lng=lng, rad=rad):
            spots_within_distance.append(spot)

    return spots_within_distance


def get_recommended_spots() -> list[str]:
    """Retrieve recomended spots based on some recommendation algorithm. Dummy function for now.

    Returns
        list[str]: 3 spots in JSON format
    """
    return [spot for spot in DB_CLIENT.search_spots("")][:3]


### UTILS
def is_spot_within_distance(spot: dict, lat: float, lng: float, rad: int) -> bool:
    """Encapsulates logic to determine if valid distance from center"""
    ecl_dist = calculate_euclidean_distance(
        float(spot["latitude"]),  # needs refactoring in DB
        float(spot["longitude"]),  # needs refactoring in DB
        lat,
        lng,
    )
    return True if ecl_dist <= rad / RADIUS_TO_COORD_FACTOR else False


def calculate_euclidean_distance(
    lat_x: float, lng_x: float, lat_y: float, lng_y: float
) -> float:
    lat_vector = (lat_x - lat_y) ** 2
    lng_vector = (lng_x - lng_y) ** 2
    return math.sqrt(lat_vector + lng_vector)


if __name__ == "__main__":
    print(get_recommended_spots())
