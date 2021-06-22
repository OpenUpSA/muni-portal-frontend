import { BasicBlock } from "./basic-block.js";
import { LinkBlock } from "./link-block.js";

import { sendEvent } from "../utils/analytics";

export class Contact {
  constructor(contact, titleField) {
    const basicBlockTypes = ["postal_address", "fax"];
    const contactType = contact.type.slug;
    const linkBlockTypes = ["phone", "email", "physical_address"];

    let title;
    switch (titleField) {
      case "annotation":
        title = contact.annotation;
        break;
      default:
        title = contact.type.label;
    }

    if (linkBlockTypes.includes(contactType)) {
      const props = {
        title: title,
        subtitle: contact.value,
        url: Contact.getLink(contact),
        targetIconClasses: contact.type.icon_classes,
        shadedTarget: true,
      };
      if (contact.icon_classes) {
        props.subjectCardIcon = true;
        props.subjectIconClasses = contact.icon_classes;
      }
      this.$element = new LinkBlock(props).render();
      this.$element.on("click", () => {
        sendEvent({
          event: `Contact event for: ${contact.type.label}`,
          type: contact.annotation || "contact",
        });
      });
    } else if (basicBlockTypes.includes(contactType)) {
      this.$element = new BasicBlock({
        title: title,
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
    return this.$element;
  }
}
