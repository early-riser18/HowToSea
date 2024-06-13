import unittest
from unittest.mock import patch
from src.search import search_with_geospatial, SpotDB

from test import mock_db


class SearchGeoSpatialTestCases(unittest.TestCase):
    """
    1. If required values not present, should return error. If required value wrong type, should return error
    2. Constructed query should match those of a list
    3. return type: if spots_filtered_by_keyword is empty, then returns empty list, if not empty, returns non-empty list
    4. for a specific set of inputs matching records, should properly return them.
    """

    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self.tested_func = search_with_geospatial

    def test_return_value(self):

        # Should not have any spot in this location
        self.assertEqual(
            self.tested_func(lat=10, lng=10, rad=10, keywords={"level": ["hard"]}),
            [],
        )

        ### To refactor. This is subject to fail when DB gets new values
        # self.assertEqual(
        #     self.tested_func(lat=43, lng=7, rad=100, keywords={"level": ["hard"]}),
        #     [
        #         {
        #             "_id": {"$oid": "66544712a4efc40df8ac4e08"},
        #             "author_id": "tbd",
        #             "title": "Cap gros",
        #             "dateCreated": "tbd",
        #             "description": "Zone escarpée, la mise à l'eau peut-être difficile.dans la baie à la droite du cap il y a possibilité de s'abriter du courant et de trouver des profondeurs inférieures à 10m de fond avec de beaux poissons tout de même.Au bout du cap se situe un plateau à environ 8m de fond suivit du fameux tombant pouvant aller jusqu'à 30m de profondeur, parfait pour un freefall ou simplement pour rester sur le plateau et observer le passage de dorades, sars, mérous et pour les chanceux Dentis et Barracuda. De magnifiques Gorgones ornent le tombant.",
        #             "characteristics": {
        #                 "suitableFor": "all",
        #                 "fishy": True,
        #                 "reef": True,
        #                 "shipwreck": False,
        #                 "wall": False,
        #             },
        #             "image": [],
        #             "isPublished": True,
        #             "updateTs": "tbd",
        #             "lastUpdated": "13/10/2020",
        #             "latitude": "43.551923",
        #             "longitude": "7.144933",
        #             "level": "hard",
        #             "parking": "Se garer sur l'Avenue André Sella ou au parking de la plage Keller.",
        #             "address": {
        #                 "city": "Antibes",
        #                 "street": "Avenue André Sella",
        #                 "postalCode": "06600",
        #                 "country": "France",
        #             },
        #             "totalRating": 0,
        #         },
        #         {
        #             "_id": {"$oid": "665488505610228a40562419"},
        #             "author_id": "tbd",
        #             "title": "Spot 1",
        #             "dateCreated": "tbd",
        #             "description": "lorem Ipsum. la droite du cap il y a possibilité de s'abriter du courant et de trouver des profondeurs inférieures à 10m de fond avec de beaux poissons tout de même.Au bout du cap se situe un plateau à environ 8m de fond suivit du fameux tombant pouvant aller jusqu'à 30m de profondeur, parfait pour un freefall ou simplement pour rester sur le plateau et observer le passage de dorades, sars, mérous et pour les chanceux Dentis et Barracuda. De magnifiques Gorgones ornent le tombant.",
        #             "characteristics": {
        #                 "suitableFor": "all",
        #                 "fishy": True,
        #                 "reef": True,
        #                 "shipwreck": False,
        #                 "wall": False,
        #             },
        #             "image": [],
        #             "isPublished": True,
        #             "updateTs": "tbd",
        #             "lastUpdated": "13/10/2020",
        #             "latitude": "42.591923",
        #             "longitude": "6.944933",
        #             "level": "easy",
        #             "parking": "Se garer sur l'Avenue André Sella ou au parking de la plage Keller.",
        #             "address": {
        #                 "city": "Marseille",
        #                 "street": "Avenue André Sella",
        #                 "postalCode": "06600",
        #                 "country": "France",
        #             },
        #             "totalRating": 0,
        #         },
        #     ],
        # )
        ###

    def test_with_invalid_input(self):
        # Wrong types
        with self.assertRaises(TypeError):
            self.tested_func(lat=10, lng="a", rad=10, keywords={"level": ["hard"]})

        # missing expected keywords
        with self.assertRaises(KeyError):
            self.tested_func(lat=10, lng=10, rad=10, keywords={"foo": "bar"})

    @patch.object(SpotDB, "search_spots")
    def test_keyword_query(self, mock_search_spots):

        mock_search_spots.return_value = mock_db.all_results
        self.tested_func(lat=43, lng=7, rad=100, keywords={"level": ["hard"]})
        mock_search_spots.assert_called_with({"level": {"$in": ["hard"]}})


if __name__ == "__main__":
    unittest.main(verbosity=2)
