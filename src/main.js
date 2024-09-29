import mapboxgl from "mapbox-gl";
import { MapboxSearchBox } from "@mapbox/search-js-web";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const map = new mapboxgl.Map({
	container: "map", // container ID
	style: "mapbox://styles/aesbetic/cm12n0hob004s01pdf4omgtzp",
	center: [-84.39, 33.75], // starting position [lng, lat]
	zoom: 12, // starting zoom
	pitch: 55,
});

// TODO: When data is sparse, clusters won't form due to radius being set too low.
function filterBy(year, mapLayer) {
	const filters = ["<=", ["get", "YearPlanted"], year];
	map.setFilter(mapLayer.id, filters);
}

function setupPopupHandlers(mapLayer) {
	const popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false,
		color: "#232136",
		className: "max-w-400px text-moon-fg",
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

		popup.setLngLat(coordinates);

		if (properties.point_count) {
			// Clustered Feature Popup Text(Only Neighborhood)
			let neighborhood = properties.Neighborhood;

			if (!neighborhood || neighborhood === "other") {
				// If Neighborhood doesn't exist, get from neighborhing points
				// Define your center point and radius
				let center = e.point;
				let radius = 50; // in pixels

				// Calculate the bounding box for the square area
				let sw = [center.x - radius, center.y - radius];
				let ne = [center.x + radius, center.y + radius];

				// Query the features in the square area
				let features = map.queryRenderedFeatures([sw, ne], {
					filter: ["has", "Neighborhood"],
					layer: mapLayer,
				});

				neighborhood = features[0].properties.Neighborhood;
				e.features[0].properties.Neighborhood = neighborhood;
			}

			popup.setHTML(
				`<p class="m-0">${neighborhood}</p><p class="m-0">(${properties.point_count} trees)</p>`,
			);
		} else {
			// Unclustered Popup Text
			const formattedProperties = {
				Species: properties.Species,
				"Planted Date": new Date(
					properties.PlantedDate,
				).toLocaleDateString(), // Format the date
				Status: properties.Status ? "Alive" : "Dead",
				"Street Park": properties.StreetPark,
				Neighborhood: properties.Neighborhood,
			};

			popup.setHTML(`<ul class="property-list rounded-md p-4 shadow-md">
				${Object.entries(formattedProperties)
					.map(
						([key, value]) => `
    <li class="flex py-2 border-b border-gray-200">
      <span class="font-bold text-gray-700 w-1/3">${key}:</span>
      <span class="pl-2 text-gray-600">${value}</span>
    </li>`,
					)
					.join("")}
			</ul>`);
		}

		popup.addTo(map);
	});

	map.on("mouseleave", mapLayer.id, () => {
		map.getCanvas().style.cursor = "";
		popup.remove();
	});
}

map.on("load", () => {
	const styleJSON = map.getStyle();
	const mapLayer = styleJSON.layers[0];

	setupPopupHandlers(mapLayer);

	document.getElementById("slider").addEventListener("input", (e) => {
		const year = parseInt(e.target.value, 10);

		document.getElementById("year").textContent = year;
		filterBy(year, mapLayer);
	});
});

// Search Box
const searchBoxElement = new MapboxSearchBox();

searchBoxElement.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

searchBoxElement.options = {
	types: "address,poi",
	proximity: [-84.39, 33.75],
};

searchBoxElement.marker = true;
searchBoxElement.mapboxgl = mapboxgl;

searchBoxElement.theme = {
	variables: {
		colorBackground: "#232136",
		colorPrimary: "#232136",
		colorBackgroundHover: "#2a273f",
		colorSecondary: "#2a273f",
		colorText: "#e0def4",
	},
	cssText: "input { color: #e0def4 !important; border: thin !important; }",
};

searchBoxElement.marker = {
	color: "#232136",
};
map.addControl(searchBoxElement);
