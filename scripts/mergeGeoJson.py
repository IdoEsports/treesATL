import json
import os


def combine_geojson_files(input_dir, output_file):
    """Combines multiple GeoJSON files into a single GeoJSON file.

    Args:
        input_dir (str): Path to the directory containing the GeoJSON files.
        output_file (str): Path to the output GeoJSON file.
    """

    combined_features = []

    for filename in os.listdir(input_dir):
        filepath = os.path.join(input_dir, filename)
        with open(filepath, 'r') as f:
            data = json.load(f)
            # Assuming each file has a "features" array
            combined_features.extend(data['features'])

    # Create the output GeoJSON structure
    combined_geojson = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "EPSG:4326"
            }
        },
        "features": combined_features
    }

    with open(output_file, 'w') as outfile:
        json.dump(combined_geojson, outfile, indent=None)  # Indent for readability


# Example usage:
input_directory = 'assets'  # Replace with the actual path
output_geojson = 'assets/atl_trees.geojson'

combine_geojson_files(input_directory, output_geojson)
