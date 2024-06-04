from db_client import SpotDB
from bson.objectid import ObjectId
import logging
import math

RADIUS_TO_COORD_FACTOR = 100


def search_with_geospatial(lat: float, lng: float, rad: int, keywords: dict):
    """
    Currently works for single values level.
    """
    db_client = SpotDB.from_env()
    keyword_query = {"level": {"$in": keywords["level"]}}
    spots_filtered_by_keyword = [spot for spot in db_client.search_spots(keyword_query)]

    spots_within_distance = []
    for spot in spots_filtered_by_keyword:
        if is_spot_within_distance(spot=spot, lat=lat, lng=lng, rad=rad):
            spots_within_distance.append(spot)

    return spots_within_distance


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


# TODO
# TEST normal loop vs using numpy


if __name__ == "__main__":
    pass
