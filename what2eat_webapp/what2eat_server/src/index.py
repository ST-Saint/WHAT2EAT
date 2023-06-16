from jsonrpcserver import Success, Result, method, serve
import datetime
import pandas as pd
from pd_utils import load_df_from_json, dump_df_to_json
import json

class Review:
    reviewer:str
    restaurant:str
    dish:str
    score:int
    comment:str
    date: datetime.date

# TODO(return table data): add new @method and response json data

@method
def add_review(review: Review) -> Result:
    print(json.dumps(review, indent=4, ensure_ascii=False))
    review_history = load_df_from_json("reviews.json")
    review_df = pd.DataFrame([review], index=[len(review_history)])
    review_history = pd.concat([review_history, review_df])
    dump_df_to_json(review_history, "reviews.json")
    return Success("review: " + str(review) + " added")

if __name__ == "__main__":
    serve(name="localhost", port=8080)
