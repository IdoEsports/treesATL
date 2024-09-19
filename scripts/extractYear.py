import json
from datetime import datetime


def extract_year_from_planted_date(geojson_file, output_file):
    """
    Reads a GeoJSON file, extracts the year from the "PlantedDate" property (in Unix milliseconds),
    and adds a new "YearPlanted" property to each feature.

    Args:
        geojson_file (str): Path to the GeoJSON file.
    """

    with open(geojson_file, 'r') as f:
        data = json.load(f)

    for feature in data['features']:
        planted_date_ms = feature['properties'].get('PlantedDate')
        if planted_date_ms:
            # Convert Unix milliseconds to datetime object and extract year
            planted_date = datetime.fromtimestamp(planted_date_ms / 1000)
            year_planted = planted_date.year

            # Add the 'YearPlanted' property to the feature
            feature['properties']['YearPlanted'] = year_planted

    # Optionally, write the modified GeoJSON data to a new file
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=None)


# Example usage:
extract_year_from_planted_date('vector_tilesets/geojson-source/AliveAsInt.geojson',
                               'vector_tilesets/geojson-source/YearIncluded.geojson')
