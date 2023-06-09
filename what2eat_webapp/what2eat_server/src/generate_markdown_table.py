import argparse
from pd_utils import load_df_from_json, dump_df_to_md


def generate(table_name: str) -> None:
    df: DataFrame = load_df_from_json(table_name + ".json")
    dump_df_to_md(df, table_name + ".md")
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
