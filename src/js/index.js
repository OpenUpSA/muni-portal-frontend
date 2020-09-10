import {tryRegister} from './swRegistration.js';

// Call as early as possible to maximise chance of registering reinstallation code
tryRegister();

const sectionHeadingTemplate = $(".styles .section-heading").clone();

const servicesTab = $(".main .tab-link");
servicesTab.find(".icon div").removeClass("fa-spinner");
servicesTab.find(".label").text("Services");

const sectionHeading = sectionHeadingTemplate.clone();
sectionHeading.find(".section-title").text("Services");

const tabContent = $(".tab-content").append(sectionHeading);
console.log(sectionHeading);
