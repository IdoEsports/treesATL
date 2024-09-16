import json


def process_status(features):
    """Processes a GeoJSON feature list to convert "Status" to 1 or 0.

    Args:
        features: A list of GeoJSON features.

    Returns:
        A list of GeoJSON features with modified "Status" values.
    """

    for feature in features:
        status = feature['properties'].get('Status')
        if status in ("Alive", "ReadyToBePlanted", "ReadyToUpload"):
            feature['properties']['Status'] = 1
        else:
            feature['properties']['Status'] = 0
    return features


# Load your GeoJSON file
with open('vector_tilesets/cleanAtlTrees.geojson', 'r') as f:
    geojson_data = json.load(f)

# Process the "Status" property
geojson_data['features'] = process_status(geojson_data['features'])

# Save the modified GeoJSON data to a new file (or overwrite the original)
with open('vector_tilesets/AliveAsInt.geojson', 'w') as f:
    json.dump(geojson_data, f, indent=None)
