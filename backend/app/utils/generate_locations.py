import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
APP = SCRIPT_DIR.parent

JSON_PATH = APP / "data" / "location_slugs.json"
DATA_PATH = APP / "schemas" / "locations_literal.py"

def generate_location_data():
    # Check if file exists using Path's built-in method
    if not JSON_PATH.exists():
        raise FileNotFoundError(f"Could not find {JSON_PATH}")

    # Read JSON file (Path objects handle opening directly)
    with JSON_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)

    labels = set()
    for island in data.values():
        for region in island.values():
            for loc in region:
                labels.add(loc["label"])

    sorted_labels = sorted(list(labels))

    # Build the Python code content string
    code_content = '''# AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
from typing import Literal

Valid_locations = Literal[
'''
    for label in sorted_labels:
        code_content += f'    "{label}",\n'
    
    code_content += ']\n'

    # Write out to locations_data.py using Path's built-in method
    DATA_PATH.write_text(code_content, encoding="utf-8")
    print(f"Successfully updated {DATA_PATH.name} with {len(sorted_labels)} locations.")

generate_location_data()