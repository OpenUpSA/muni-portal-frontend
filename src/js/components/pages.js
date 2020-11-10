import { BasicBlock } from "./basic-block.js";
import { LinkBlock } from "./link-block.js";
import { FullWidthGrid } from "./grid.js";
import { ExpandableRichText } from "./rich-text";
import { PageTitle, SectionHeading } from "./headings.js";
import { PartyAffiliationBlock } from "./party-affiliation.js";
import { Breadcrumbs } from "./breadcrumbs.js";
import { Contact } from "./contact.js";
import { ServicePoint } from "./service-point.js";

export class ModalPage {
  constructor(element) {
    console.assert(element.length === 1);
    this.element = element;
    this.page = element.find(".page-content");
  }

  setContent(content) {
    this.page.empty();
    this.page.append(content);
  }

  hide() {
    this.element.addClass("hidden");
  }

  show() {
    this.page.empty();
    this.element.removeClass("hidden");
  }
}

class Page {
  constructor(content) {
    this.name = content.title;
    this.overview = content.overview;
    // drop the first two entries from the array
    const breadcrumbs = content.ancestor_pages.slice(2);
    // add a label property to the crumb
    const breadcrumbsWithLabel = breadcrumbs.map((crumb) => {
      crumb.label = crumb.title;
      return crumb;
    });
    this.breadcrumbItems = breadcrumbsWithLabel;
    this.childPages = content.child_pages;
    this.role = content.job_title;
    this.politicalParty = content.political_party;
    this.profileImage = content.profile_image;
    this.contacts = this.initContacts(content);
  }

  initContacts() {
    return [];
  }

  render() {
    return [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
      ...this.renderProfileImage(),
      ...this.renderPartyAffiliation(),
      ...this.renderOverview(),
      ...this.renderContacts(),
      ...this.renderChildPageLinks(),
    ];
  }

  renderProfileImage() {
    const elements = [];
    if (this.profileImage) {
      const imageUrl = this.profileImage.meta.download_url;
      const imageAlt = this.profileImage.title;
      elements.push($(`<img src="${imageUrl}" alt="${imageAlt}"></img>`));
    }
    return elements;
  }

  renderPartyAffiliation() {
    const elements = [];

    if (this.politicalParty) {
      elements.push(
        new PartyAffiliationBlock({
          partyLogo: this.politicalParty.logo_image_tumbnail,
          partyName: this.politicalParty.name,
          partyAbbr: this.politicalParty.abbreviation,
        }).render()
      );
    }
    return elements;
  }

  renderOverview() {
    const elements = [];
    if (this.overview) {
      elements.push(
        new SectionHeading("Overview").render(),
        new ExpandableRichText(this.overview).render()
      );
    }
    return elements;
  }

  renderContacts() {
    const elements = [];
    if (this.contacts && this.contacts.length > 0) {
      elements.push(
        new SectionHeading("Contacts").render(),
        new FullWidthGrid(this.contacts).render()
      );
    }
    return elements;
  }

  renderChildPageLinks() {
    const childPageLinks = this.childPages.map((page) => {
      const props = {
        title: page.title,
        url: page.url,
        subtitle: "",
      };

      // councillors have a job title we can pass as the subtitle
      if (page.job_title) {
        props.subtitle = page.job_title;
      }

      if (page.profile_image_thumbnail) {
        props.profileImageThumbnail = page.profile_image_thumbnail;
      }

      // only pass `subjectIconClasses` if it is specified in the data
      if (page.icon_classes) {
        props.subjectIconClasses = page.icon_classes;
      }

      return new LinkBlock(props);
    });

    if (childPageLinks.length) {
      return [new FullWidthGrid(childPageLinks).render()];
    } else {
      return [];
    }
  }
}

export class AdministrationIndex extends Page {}

export class PoliticalRepsIndexPage extends Page {}

export class CouncillorGroupPage extends Page {
  constructor(content) {
    super(content);
    this.members = content.councillors;
    this.membersLabel = content.members_label;
  }

  render() {
    return [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
      ...this.renderProfileImage(),
      ...this.renderPartyAffiliation(),
      ...this.renderOverview(),
      ...this.renderCouncillorLinks(),
      ...this.renderContacts(),
      ...this.renderChildPageLinks(),
    ];
  }

  renderCouncillorLinks() {
    const memberLinks = this.members.map((page) => {
      const props = {
        title: page.title,
        subtitle: "",
        url: page.url,
        subjectIconClasses: page.icon_classes,
      };

      if (page.job_title) {
        props.subtitle = page.job_title;
      }

      if (page.profile_image_thumbnail) {
        props.profileImageThumbnail = page.profile_image_thumbnail;
      }

      return new LinkBlock(props);
    });

    if (memberLinks.length) {
      return [
        new SectionHeading(this.membersLabel).render(),
        new FullWidthGrid(memberLinks).render(),
      ];
    } else {
      return [];
    }
  }
}

export class CouncillorListPage extends Page {}

export class PersonPage extends Page {
  render() {
    const pageContent = [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
      ...this.renderProfileImage(),
    ];

    if (this.role) {
      pageContent.push(...this.renderRole());
    }

    pageContent.push(
      ...this.renderPartyAffiliation(),
      ...this.renderOverview(),
      ...this.renderContacts(),
      ...this.renderChildPageLinks()
    );

    return pageContent;
  }

  renderRole() {
    return new BasicBlock({
      title: "Role",
      subtitle: this.role,
    }).render();
  }

  initContacts(content) {
    return content.person_contacts.map((details) => new Contact(details));
  }
}

export class AdministratorPage extends PersonPage {}

export class CouncillorPage extends PersonPage {}

export class ErrorPage {
  constructor(error) {
    this.error = error;
  }

  render() {
    return this.error;
  }
}

export class Service {
  constructor(service) {
    this.breadcrumbItems = [{ label: "Services", url: "/services/" }];
    const serviceContacts =
      service.service_contacts || service.service_point_contacts;

    if (service.ancestor_pages.length > 0) {
      // drop the first two entries from the array
      const breadcrumbs = service.ancestor_pages.slice(2);
      // add a label property to the crumb
      const breadcrumbsWithLabel = breadcrumbs.map((crumb) => {
        crumb.label = crumb.title;
        return crumb;
      });
      this.breadcrumbItems = breadcrumbsWithLabel;
    }

    this.name = service.title;
    this.overview = service.overview;

    if (service.head_of_service) {
      const props = {
        title: service.head_of_service.title,
        subtitle: service.head_of_service.job_title,
        url: service.head_of_service.url,
      };

      if (service.head_of_service.profile_image_thumbnail) {
        props.profileImageThumbnail =
          service.head_of_service.profile_image_thumbnail;
      }

      this.headOfService = new LinkBlock(props);
    }

    this.servicePoints = service.child_pages.map(
      (servicePoint) => new ServicePoint(servicePoint)
    );
    this.contacts = serviceContacts.map((details) => new Contact(details));
  }

  render() {
    const children = [
      new PageTitle(this.name).render(),
      new Breadcrumbs(this.breadcrumbItems).render(),
    ];

    if (this.overview.trim() !== "") {
      children.push(
        new SectionHeading("Overview").render(),
        new ExpandableRichText(this.overview).render()
      );
    }

    if (this.servicePoints.length > 0) {
      children.push(
        new SectionHeading("Service points").render(),
        new FullWidthGrid(this.servicePoints).render()
      );
    }

    if (this.contacts.length > 0) {
      const contacts = [];

      if (this.headOfService) {
        contacts.push(this.headOfService);
      }

      contacts.push(...this.contacts);

      children.push(
        new SectionHeading("Contacts").render(),
        new FullWidthGrid(contacts).render()
      );
    }
    return children;
  }
}

export class ServicePointPage extends Service {}
