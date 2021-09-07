export const sendEvent = (eventObject) => {
  if (dataLayer) {
    dataLayer.push(eventObject);
  } else {
    console.warn("datalayer not defined when sending event", eventObject);
  }
};
