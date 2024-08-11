import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/mapbox/streets-v12", // style URL
	center: [-84.39, 33.75], // starting position [lng, lat]
	zoom: 10, // starting zoom
});

map.on("load", () => {
	map.addLayer({
		id: "test-trees",
		type: "circle",
		source: {
			type: "geojson",
			data: "assets/cleanAtlTrees.geojson",
		},
	});
});
