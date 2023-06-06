from enum import Enum
from typing import Set
from typing import List
import json

from review import Review

class Tag(Enum):
    Chinese = "Chinese"
    Indian = "Indian"
    Korean = "Korean"
    Mexican = "Mexican"
    Thai = "Thai"
    Malaysian = "Malaysian"
    Vietnamese = "Vietnamese"
    Japanese = "Japanese"
    Chicken = "Chicken"
    Sushi = "Sushi"
    Pizza = "Pizza"
    Pasta = "Pasta"
    Desserts = "Desserts"
    Burger = "Burger"
    Poke = "Poke"
    Ramen = "Ramen"
    BBQ = "BBQ"
    Sandwich = "Sandwich"
    Vegan = "Vegan"
    Greek = "Greek"

class ObjectEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        elif isinstance(obj, dict):
            return vars(obj)
        elif isinstance(obj, Enum):
            return obj.value
        return json.JSONEncoder.default(self, obj)

class Review:
    rate: int
    reviewer: str
    comments: List[str]
    def __init__(self):
        pass

class Restaurant(object):
    name: str = ""
    location: str = ""
    tags: Set[Tag] = set()
    reviews: List[Review] = []
    rate: float = 0
    public_rate: float = 0

    def __init__(self):
        self.tags = {Tag.Thai}
        pass
