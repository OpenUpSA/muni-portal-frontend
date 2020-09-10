import {tryRegister} from './swRegistration.js';

// Call as early as possible to maximise chance of registering reinstallation code
tryRegister();

const sectionHeadingTemplate = $(".styles .section-heading").clone();
const gridThirdsTemplate = $(".styles .grid--thirds").clone();
const actionCardTemplate = $(".styles .card.action").clone();

const servicesTab = $(".main .tab-link");
servicesTab.find(".icon div").removeClass("fas fa-spinner").addClass("fas fa-hands-helping");
servicesTab.find(".label").text("Services");

const sectionHeading = sectionHeadingTemplate.clone();
sectionHeading.find(".section-title").text("Services");

const tabContent = $(".tab-content").append(sectionHeading);
console.log(sectionHeading);

const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
const baseUrl = defaultBaseUrl;

const servicePagesUrl = `${baseUrl}/api/wagtail/v2/pages/?type=core.ServicePage&fields=overview,icon_classes`;
$.get(servicePagesUrl)
  .done(function(response) {
    const grid = gridThirdsTemplate.clone();
    grid.empty();
    tabContent.append(grid);

    response.items.forEach(function(item) {
      const card = actionCardTemplate.clone();
      card.find(".label").text(item.title);
      card.find(".icon div").removeClass("fas fa-spinner").addClass(item.icon_classes);
      grid.append(card);
    });

  })
  .fail(function(a, b) {
    console.error(a, b);
  });
