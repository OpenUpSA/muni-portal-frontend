export const sendEvent = (eventObject) => {
  if (dataLayer) {
    dataLayer.push(eventObject);
  }
};
