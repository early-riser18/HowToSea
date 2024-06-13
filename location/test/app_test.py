import json
import unittest
from unittest.mock import patch
from app import app
from src.utils import SEARCH_PARAMS_TYPE


class SearchUnitTestCase(unittest.TestCase):
    @patch("routes.typecast_query_params")
    def test_extracted_query_params(self, mock_typecast):
        with app.test_client() as client:
            client.get(
                "/search",
                query_string="lat=33&lng=21&rad=120&level=easy&level=medium",
            )

            mock_typecast.assert_called_once_with(
                {"lat": "33", "lng": "21", "rad": "120", "level": ["easy", "medium"]},
                SEARCH_PARAMS_TYPE,
            )

        # Missing required params level
        with app.test_client() as client:
            res = client.get(
                "/search",
                query_string="lat=33&lng=21&rad=120",
            )

            self.assertEqual(res.status_code, 400)


class SearchEndToEndTestCase(unittest.TestCase):

    # TODO: Need to figure out how to properly test the response.
    def test_with_valid_inputs(self):
        with app.test_client() as client:
            response_1 = client.get(
                "/search",
                query_string="lat=43&lng=7&rad=100&level=hard&level=medium",
            )
            self.assertEqual(response_1.status_code, 200)
            response_1_data = json.loads(response_1.data)
            # Check that at least some results were returned
            self.assertGreater(len(response_1_data["data"]), 0)

        # No valid spot is every expected there
        response_2 = client.get(
            "/search",
            query_string="lat=0&lng=0&rad=10&level=easy",
        )
        response_2_data = json.loads(response_2.data)
        self.assertEqual(len(response_2_data["data"]), 0)


if __name__ == ("__main__"):
    unittest.main(verbosity=2)
