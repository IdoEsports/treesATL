import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/aesbetic/cm0lb503k025v01qrfdorcejd/draft",
	center: [-84.39, 33.75], // starting position [lng, lat]
	zoom: 11.8, // starting zoom
	pitch: 55,
});

// cleanAtlTrees
map.on("load", () => {
	const styleJSON = map.getStyle();
	const mapLayer = styleJSON.layers[0];

	const popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false,
		className: "max-w-400px",
	});

	map.on("mouseenter", mapLayer.id, (e) => {
		map.getCanvas().style.cursor = "pointer";

		const coordinates = e.features[0].geometry.coordinates.slice();
		const properties = e.features[0].properties;

		// Ensure that if the map is zoomed out such that multiple
		// copies of the feature are visible, the popup appears
		// over the copy being pointed to. (I'm not too sure)
		if (
			["mercator", "equirectangular"].includes(map.getProjection().name)
		) {
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}
		}

		popup
			.setLngLat(coordinates)
			.setHTML(properties.Neighborhood)
			.addTo(map);
	});

	map.on("mouseleave", mapLayer.id, () => {
		map.getCanvas().style.cursor = "";
		popup.remove();
	});
});
