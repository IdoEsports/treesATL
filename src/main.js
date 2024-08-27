import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map", // container ID
	center: [-84.39, 33.75], // starting position [lng, lat]
	zoom: 10, // starting zoom
});

map.on("load", () => {
	map.addSource("atlTrees", {
		type: "vector",
		url: "mapbox://aesbetic.dm3l7qzl",
	});

	map.addLayer({
		id: "trees",
		type: "circle",
		source: "atlTrees",
		"source-layer": "cleanAtlTrees",
		filter: ["has", "point_count"],
		paint: {
			/*
				TODO: opacity of cluster color should be proportional to alive percentage.
				Use tippecanoe to embed number of alive trees as a property of the cluster.
			*/
			"circle-color": [
				"step",
				["get", "point_count"],
				"#51bbd6",
				100,
				"#f1f075",
				750,
				"#f28cb1",
			],
			"circle-radius": [
				"step",
				["get", "point_count"],
				5,
				100,
				8,
				750,
				12,
			],
		},
	});

	map.addLayer({
		id: "unclustered-point",
		type: "circle",
		source: "atlTrees",
		"source-layer": "cleanAtlTrees",
		filter: ["!", ["has", "point_count"]],
		paint: {
			// "circle-color": "#11b4da",
			"circle-radius": 4,
			// "circle-stroke-width": 1,
			// "circle-stroke-color": "#fff",
		},
	});
});
//
// map.on("style.load", () => {
// 	map.setConfigProperty("basemap", "show3dObjects", true);
// });
