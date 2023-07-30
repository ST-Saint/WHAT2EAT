from flask import Flask, Response, request
from jsonrpcserver import Success, Result, method, serve, dispatch
import datetime
import pandas as pd
from pd_utils import load_df_from_json, dump_df_to_json
import json


class Review:
    reviewer: str
    restaurant: str
    dish: str
    score: float
    comment: str
    date: datetime.date


# TODO(return table data): add new @method and response json data

app = Flask(__name__)


@method
def get_restaurants() -> Result:
    review_df = load_df_from_json("reviews.json")
    restaurants = list(pd.unique(review_df["restaurant"].iloc[::-1]))
    return Success(restaurants)


@method
def get_reviewers() -> Result:
    review_df = load_df_from_json("reviews.json")
    review_df = review_df[["reviewer"]].groupby("reviewer").size().sort_values(ascending=False)
    reviewers = review_df.index.to_list()
    return Success(reviewers)


@method
def get_reviews() -> Result:
    review_df = load_df_from_json("reviews.json")
    reviews_str = review_df.to_json(orient="records")
    reviews = []
    if reviews_str:
        reviews = json.loads(reviews_str)
    return Success(reviews)

@method
def add_review(review: Review) -> Result:
    print(json.dumps(review, indent=4, ensure_ascii=False))
    review_history = load_df_from_json("reviews.json")
    review_df = pd.DataFrame([review], index=[len(review_history)])
    review_history = pd.concat([review_history, review_df])
    dump_df_to_json(review_history, "reviews.json")
    return Success("review: " + str(review) + " added")


@app.route("/", methods=["OPTIONS"])
def OPTIONS():
    resp = Response()
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Request-Method"] = "POST,OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    resp.headers["Content-Type"] = "text/plain;charset=UTF-8"
    return resp


@app.route("/", methods=["POST"])
def index():
    resp = Response(
        dispatch(request.get_data().decode()), content_type="application/json"
    )
    resp.headers["Access-Control-Allow-Origin"] = "*"
    return resp


if __name__ == "__main__":
    app.run()
