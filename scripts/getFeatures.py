import json
import requests
import os
import re
import urllib.parse


def get_feature_urls(har_file):
    with open(har_file, 'r') as f:
        har_data = json.load(f)

    unique_urls = set()
    for entry in har_data['log']['entries']:
        url = entry['request']['url']
        if 'FeatureServer' in url and 'f=json' not in url:
            unique_urls.add(
                url.replace("f=pbf", "f=geojson").replace(
                    "outSR=102100",
                    "outSR=4326"))  # PBF -> GeoJSON and Web Mercator -> WGS 84

    print(f"Unique URLs: {len(unique_urls)}")
    return list(unique_urls)


def download_geojson_files(urls, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    for i, url in enumerate(urls):
        try:
            response = requests.get(url)
            response.raise_for_status()

            decoded_url = urllib.parse.unquote(url)
            pattern = r'geometry=\{"xmin":(\-[0-9]+\.[0-9]+),"ymin":([0-9]+\.[0-9]+),"xmax":(\-[0-9]+\.[0-9]+),"ymax":([0-9]+\.[0-9]+),'
            match = re.search(pattern, decoded_url)

            if match:
                xmin, ymin, xmax, ymax = match.groups()
                filename = f"region_({xmin}, {xmax})_({ymin}, {ymax}).geojson"
            else:
                filename = f"region_{i+1}.geojson"

            filepath = os.path.join(output_dir, filename)
            with open(filepath, 'w') as f:
                f.write(response.text)

            print(f"Created {filepath}")

        except requests.exceptions.RequestException as e:
            print(f"Error downloading {url}: {e}")


har_file = "scripts/all.har"
urls = get_feature_urls(har_file)

output_dir = "allTrees"
download_geojson_files(urls, output_dir)
