/**
 * Set or update the location of service request output and hidden field.
 * @param {array} coordinates - the lat and lng as an array
 */
function setSelectedLocation(coordinates) {
  const $serviceRequestLocationPicker = $("#service-request-location-picker");
  const $coordinatesHiddenField = $("#service-request-coordinates");
  const $coordinatesOutput =
    $serviceRequestLocationPicker &&
    $serviceRequestLocationPicker.find(".map-coordinates");
  const $removeCoordinatesButton = $serviceRequestLocationPicker.find(
    ".button--remove-location"
  );

  if ($coordinatesOutput) {
    $coordinatesOutput.text(coordinates.join(", "));
  }

  if ($coordinatesHiddenField) {
    $coordinatesHiddenField.val(coordinates.join(", "));
  }

  if ($removeCoordinatesButton) {
    $removeCoordinatesButton.removeClass("button--disabled");
    $removeCoordinatesButton.on("click", (event) => {
      event.preventDefault();

      $coordinatesHiddenField.val("");
      $coordinatesOutput.text("No location selected");
      $removeCoordinatesButton.addClass("button--disabled");
      $(this).off(event);
    });
  }
}

/**
 * Called when the user dragged and then drops the map marker. It
 * gets the marker’s location and updates the location of your service
 * request output field. Also sets the associated hidden form field.
 * @param {object} map - the current map instance
 * @param {object} marker - the current marker instance
 */
function getMarkerLocation(map, marker) {
  const coordinates = marker.getLatLng();

  marker.setLatLng(coordinates);
  map.setView(coordinates, 15);

  setSelectedLocation([coordinates.lat, coordinates.lng]);
}

/**
 * Called when the user clicks the "Use my location" button. Get's the
 * users current location and updates the location of your service
 * request output field. Also sets the associated hidden form field.
 * @param {object} map - the current map instance
 * @param {object} marker - the current marker instance
 */
function getLocation(map, marker) {
  map.locate({ setView: true });

  map.on("locationerror", (error) => console.error(error));

  map.on("locationfound", (location) => {
    const coordinates = [location.latitude, location.longitude];

    marker.setLatLng(coordinates);
    map.setView(coordinates, 13);

    setSelectedLocation(coordinates);
  });
}

/**
 * Initialize the leafletjs map
 */
export const initMap = () => {
  // ensure leafletjs loaded successfully before using it
  if (L) {
    const defaultCoordinates = [-34.8311103, 20.0043008];
    const initialMapOptions = {
      center: defaultCoordinates,
      maxZoom: 18,
      zoom: 15,
    };
    const $mapButton = $("#service-request-location-picker .map-button");
    const mapContainer = document.querySelector(
      "#service-request-location-picker .map-container"
    );
    const token =
      "pk.eyJ1IjoiamJvdGhtYSIsImEiOiJja21xdHc4c2UwMWhvMnJzMDBrb3BvamQzIn0.oKcrud8x9JjIXsNHgIbJZQ";
    const tileLayerOptions = {
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: token,
    };
    const map = L.map(mapContainer, initialMapOptions);

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
      tileLayerOptions
    ).addTo(map);

    const marker = L.marker(defaultCoordinates).addTo(map);

    map.on("moveend", () => {
      getMarkerLocation(map, marker);
    });

    if ($mapButton) {
      $mapButton.on("click", () => {
        getLocation(map, marker);
      });
    }
  }
};
