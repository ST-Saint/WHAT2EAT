import pandas as pd
from pandas.io.formats.style_render import DataFrame
import os
import json

data_dir = "data/"


def load_df_from_json(filename: str) -> DataFrame:
    filepath: str = data_dir + filename
    if not os.path.exists(filepath):
        print("table does not exist")
        exit(1)
    with open(filepath, "r") as f:
        data: str = f.read()
        return pd.read_json(data, orient="split", convert_dates=False)


def dump_df_to_json(df: DataFrame, filename: str) -> None:
    filepath: str = data_dir + filename
    json_content: str | None = df.to_json(orient="split", force_ascii=False)
    if json_content != None:
        json_content = json.dumps(json.loads(json_content), indent=4, ensure_ascii=False)
        with open(filepath, "w") as f:
            f.write(json_content)


def dump_df_to_md(df: DataFrame, filename: str) -> None:
    filepath: str = data_dir + filename
    table_content: str | None = df.to_markdown()
    if table_content != None:
        with open(filepath, "w") as f:
            f.write("# " + filename.split(".")[0] + "\n")
            f.write(table_content)
