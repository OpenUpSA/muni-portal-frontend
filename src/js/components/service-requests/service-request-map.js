import { sendEvent } from "../../utils/analytics";

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
 * Called when the user clicks the "Use my location" button. Get's the
 * users current location and updates the location of your service
 * request output field. Also sets the associated hidden form field.
 * @param {object} map - the current map instance
 */
function getLocation(map) {
  map.locate({ setView: true });

  map.on("locationerror", (error) => console.error(error));

  map.on("locationfound", (location) => {
    const coordinates = [location.latitude, location.longitude];
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
    const token = `${process.env.MAPBOX_TOKEN}`;
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

    map.on("moveend", () => {
      const coordinates = map.getCenter();
      setSelectedLocation([coordinates.lat, coordinates.lng]);
    });

    if ($mapButton) {
      $mapButton.on("click", () => {
        getLocation(map);
        sendEvent({
          event: "service-request-location-picker",
          type: "map-location",
        });
      });
    }
  }
};
