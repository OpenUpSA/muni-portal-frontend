import { LinkBlock } from "./link-block.js";

export class ServicePoint extends LinkBlock {
  constructor(servicePoint) {
    super({
      title: servicePoint.title,
      url: servicePoint.url,
    });
  }
}
