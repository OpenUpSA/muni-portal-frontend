export function addStaticMapListener() {
  document.addEventListener("add-static-map", (event) => {
    if ($("#static-service-request-map") && L) {
      const staticMapOptions = {
        center: event.detail.split(","),
        dragging: false,
        maxZoom: 18,
        scrollWheelZoom: false,
        touchZoom: false,
        zoom: 15,
        zoomControl: false,
      };

      const token = `${process.env.MAPBOX_TOKEN}`;
      const tileLayerOptions = {
        id: "mapbox/streets-v11",
        draggable: false,
        tileSize: 512,
        zoomOffset: -1,
        accessToken: token,
      };
      const map = L.map("static-service-request-map", staticMapOptions);

      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        tileLayerOptions
      ).addTo(map);

      L.marker(event.detail.split(",")).addTo(map);
    }
  });
}
