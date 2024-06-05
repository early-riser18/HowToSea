import unittest
import utils


class TypecastQueryParamsTestCases(unittest.TestCase):

    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self.tested_func = utils.typecast_query_params
        self.mapping_builtin_types = {
            "key_a": float,
            "key_b": int,
            "key_c": list,
            "key_d": dict,
            "key_e": bool,
            "key_f": tuple,
            "key_g": complex,
        }
        self.mapping_iter_innertypes = {
            "key_a": list[str],
            "key_b": list[float],
            "key_c": tuple[str],
            "key_d": tuple[float],
        }

    def setUp(self) -> None:
        """call before every test is run"""
        pass

    def tearDown(self) -> None:
        """called after every test is run"""
        pass

    def test_with_none_values(self):
        self.assertEqual(
            self.tested_func(
                {
                    "key_a": None,
                    "key_b": None,
                    "key_c": None,
                    "key_d": None,
                    "key_e": None,
                    "key_f": None,
                    "key_g": None,
                },
                self.mapping_builtin_types,
            ),
            {
                "key_a": None,
                "key_b": None,
                "key_c": None,
                "key_d": None,
                "key_e": None,
                "key_f": None,
                "key_g": None,
            },
        )

    def test_with_normal_values(self):
        self.assertEqual(
            self.tested_func(
                {
                    "key_a": "10.0002",
                    "key_b": "987322",
                    "key_c": "ab",
                    "key_d": {"foo": "bar", "foo1": 1.2},
                    "key_e": "true",
                    "key_f": "ab",
                    "key_g": "5-9j",
                },
                self.mapping_builtin_types,
            ),
            {
                "key_a": 10.0002,
                "key_b": 987322,
                "key_c": ["a", "b"],
                "key_d": {"foo": "bar", "foo1": 1.2},
                "key_e": True,
                "key_f": ("a", "b"),
                "key_g": (5 - 9j),
            },
        )

        self.assertEqual(
            self.tested_func(
                {
                    "key_a": ["a", "b"],
                    "key_b": ["1.2", "3.4"],
                    "key_c": ["a", "b"],
                    "key_d": ["1.2", "3.4"],
                },
                self.mapping_iter_innertypes,
            ),
            {
                "key_a": ["a", "b"],
                "key_b": [1.2, 3.4],
                "key_c": ("a", "b"),
                "key_d": (1.2, 3.4),
            },
        )

    def test_with_missing_query_params(self):
        self.assertEqual(
            self.tested_func(
                {
                    "key_a": "10.0002",
                    "key_b": "987322",
                    "key_c": "ab",
                    # key_d is missing
                    "key_e": "true",
                    "key_f": "ab",
                    "key_g": "5-9j",
                },
                self.mapping_builtin_types,
            ),
            {
                "key_a": 10.0002,
                "key_b": 987322,
                "key_c": ["a", "b"],
                "key_e": True,
                "key_f": ("a", "b"),
                "key_g": (5 - 9j),
            },
        )

    def test_with_missing_mapping(self):
        """A key found in the query_params but not in mapping should raise a KeyError"""
        with self.assertRaises(KeyError):
            self.tested_func(
                {"key_a": "10.0002", "key_b": "987322", "unmapped_key": "foo"},
                self.mapping_builtin_types,
            )

    def test_with_wrong_values(self):
        """Passing a value that cannot be typecasted should raise a value error."""
        with self.assertRaises(ValueError):
            self.tested_func(
                {"key_a": "10.0002", "key_b": "a"}, self.mapping_builtin_types
            )


class CreateJsonApiResponseTestCases(unittest.TestCase):
    pass


if __name__ == "__main__":
    unittest.main(verbosity=2)
