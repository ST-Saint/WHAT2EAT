import argparse
import pandas as pd
from pandas.io.formats.style_render import DataFrame
import os


def load_df_from_json(filepath: str) -> DataFrame:
    if not os.path.exists(filepath):
        print("table does not exist")
        exit(1)
    with open(filepath, "r") as f:
        data: str = f.read()
        return pd.read_json(data, orient="split", convert_dates=False)


def generate(table_name: str) -> None:
    df: DataFrame = load_df_from_json(table_name + ".json")
    with open(table_name + ".md", "w") as f:
        table_content: str | None = df.to_markdown()
        f.write("# " + table_name + "\n")
        if table_content != None:
            f.write(table_content)
    return


if __name__ == "__main__":
    # Create the parser object
    parser = argparse.ArgumentParser(description="Print Formatted Markdown Table")

    # Add an argument to the parser
    parser.add_argument("table", type=str, help="the table to be generated")

    # Parse the arguments
    args = parser.parse_args()

    # Access the parsed arguments
    generate(args.table)
