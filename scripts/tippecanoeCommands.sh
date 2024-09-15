# Accumulate Alive trees at 15px cluster radius
tippecanoe -z 16 -kg -o vector_tilesets/clustered_trees15px.mbtiles -r1 --cluster-distance=15 --accumulate-attribute=Status:sum vector_tilesets/cleanAtlTrees.geojson
