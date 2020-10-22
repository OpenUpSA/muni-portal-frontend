import { LinkBlock } from "./link-block.js";

export class Contact extends LinkBlock {
  constructor(contact) {
    super({
      title: contact.type.label,
      subtitle: contact.value,
      url: Contact.getLink(contact),
      targetIconClasses: contact.type.icon_classes,
      shadedTarget: true,
    });
  }

  static getLink(contact) {
    switch (contact.type.slug) {
      case "phone":
        return `tel:${contact.value}`;
      case "email":
        return `mailto:${contact.value}`;
      case "physical_address":
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          contact.value
        )}`;
      default:
        return "#";
    }
  }
}
