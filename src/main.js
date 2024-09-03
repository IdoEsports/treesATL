import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/aesbetic/cm0lb503k025v01qrfdorcejd/draft",
	center: [-84.39, 33.75], // starting position [lng, lat]
	zoom: 11.8, // starting zoom
	pitch: 55,
});

/*
	TODO: Add popups
*/

// map.on("load", () => {
// 	map.addSource("atlTrees", {
// 		type: "vector",
// 		url: "mapbox://aesbetic.Atlanta_Trees",
// 	});
//
// 	map.addLayer({
// 		id: "trees",
// 		type: "circle",
// 		source: "atlTrees",
// 		"source-layer": "Atlanta_Trees",
// 	});
//
// 	map.on("style.load", () => {
// 		map.setConfigProperty("basemap", "show3dObjects", true);
// 	});
// });
