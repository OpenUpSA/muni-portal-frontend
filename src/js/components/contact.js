import { BasicBlock } from "./basic-block.js";
import { LinkBlock } from "./link-block.js";

export class Contact {
  constructor(contact) {
    const basicBlockTypes = ["postal_address", "fax"];
    const contactType = contact.type.slug;
    const linkBlockTypes = ["phone", "email", "physical_address"];

    if (linkBlockTypes.includes(contactType)) {
      this.element = new LinkBlock({
        title: contact.type.label,
        subtitle: contact.value,
        url: Contact.getLink(contact),
        targetIconClasses: contact.type.icon_classes,
        shadedTarget: true,
      }).render();
    } else if (basicBlockTypes.includes(contactType)) {
      this.element = new BasicBlock({
        title: contact.type.label,
        subtitle: contact.value,
      }).render();
    }
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

  render() {
    return this.element;
  }
}
