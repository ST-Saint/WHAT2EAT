import unittest


class TestAddNumbers(unittest.TestCase):
    def test_json_serialization():
        res = Restaurant()
        res.name = "Taste of Thai"
        res.tags.add(Tag.Thai)
        json_data = json.dumps(vars(res), cls=ObjectEncoder)
