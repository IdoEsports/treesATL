import mapboxgl from "mapbox-gl";
// import { readFile } from "fs/promises";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/streets-v12", // style URL
	center: [-84.39, 33.75], // starting position [lng, lat]
	zoom: 3, // starting zoom
});

const geojson = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			geometry: {
				type: "circle",
				coordinates: [-77.032, 38.913],
			},
			properties: {
				title: "Mapbox",
				description: "Washington, D.C.",
			},
		},
		{
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: [-122.414, 37.776],
			},
			properties: {
				title: "Mapbox",
				description: "San Francisco, California",
			},
		},
	],
};

for (const feature of geojson.features) {
	const el = document.createElement("div");
	el.className = "marker";

	new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);
}
