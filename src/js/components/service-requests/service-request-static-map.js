export function addStaticMapListener() {
  document.addEventListener("add-static-map", (event) => {
    if ($("#static-service-request-map") && L) {
      const staticMapOptions = {
        center: event.detail.split(","),
        maxZoom: 18,
        zoom: 15,
      };

      const token =
        "pk.eyJ1IjoiamJvdGhtYSIsImEiOiJja21xdHc4c2UwMWhvMnJzMDBrb3BvamQzIn0.oKcrud8x9JjIXsNHgIbJZQ";
      const tileLayerOptions = {
        id: "mapbox/streets-v11",
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
