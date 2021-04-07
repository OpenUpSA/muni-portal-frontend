import { API } from "../../api";
import { TASK_TYPES } from "../constants";

import { FullWidthGrid } from "../grid";
import { ServiceRequestSubmitted } from "./service-request-submitted";
import { StatusMessage } from "../molecules/status-message";
import { getFieldset, getLabel, getLegend } from "../../utils/element-factory";

export class SubmitServiceRequest {
  constructor() {
    const api = new API();

    const $dropdownContainer = $(".components .dropdown:eq(0)").clone();
    const $dropdownCurrentSelection = $dropdownContainer.find(
      ".dropdown__current-selection"
    );
    const $dropdownList = $dropdownContainer.find(".w-dropdown-list");
    const $dropdownOption = $dropdownContainer.find(".w-dropdown-link");
    const $form = $("<form />", {
      name: "submit-service-request",
      method: "post",
      action: "",
    });
    const $formInputTmpl = $(".components .input-field:eq(0)");
    const $requiredFieldsNote = $(".components .form-item .form-label").clone();
    const $textAreaTmpl = $(".components .form__input-field--large");
    const $typeHiddenField = $("<input/>", {
      id: "service-area",
      type: "hidden",
      name: "type",
    });

    const $serviceAreaFieldset = getFieldset();
    const $serviceAreaLegend = getLegend("Service area of request *");

    $dropdownOption.remove();
    $dropdownCurrentSelection.text("Select service area");

    TASK_TYPES.forEach((task) => {
      $dropdownList.append($dropdownOption.clone().text(task));
    });

    $dropdownList.on("click", (event) => {
      $typeHiddenField.attr("value", $(event.target).text());
      $dropdownCurrentSelection.text($(event.target).text());

      // Close a dropdown when one of its options are selected
      $dropdownContainer.triggerHandler("w-close.w-dropdown");
    });

    $serviceAreaFieldset.append([
      $serviceAreaLegend,
      $typeHiddenField,
      $dropdownContainer,
    ]);

    const $addressFieldset = getFieldset();
    const $addressLegend = getLegend("Address");

    const $streetNameLabel = getLabel("Street name");
    const $streetNameInput = $formInputTmpl.clone().attr({
      id: "street-name",
      name: "street_name",
      placeholder: "",
    });

    const $streetNumberLabel = getLabel("Street Number");
    const $streetNumberInput = $formInputTmpl.clone().attr({
      id: "street-number",
      name: "street_number",
      type: "number",
      placeholder: "",
    });

    const $townLabel = getLabel("Town");
    const $townInput = $formInputTmpl.clone().attr({
      id: "town",
      name: "suburb",
      type: "text",
      placeholder: "",
    });

    $addressFieldset.append([
      $addressLegend,
      $streetNameLabel,
      $streetNameInput,
      $streetNumberLabel,
      $streetNumberInput,
      $townLabel,
      $townInput,
    ]);

    const $yourInfoFieldset = getFieldset();
    const $yourInfoLegend = getLegend("Your information");

    const $firstNameLabel = getLabel("First name *");
    const $firstNameInput = $formInputTmpl.clone().attr({
      id: "first-name",
      name: "user_name",
      placeholder: "",
      required: true,
    });

    const $lastNameLabel = getLabel("Last name *");
    const $lastNameInput = $formInputTmpl.clone().attr({
      id: "last-name",
      name: "user_surname",
      placeholder: "",
      required: true,
    });

    const $cellNumberLabel = getLabel("Cellphone number");
    const $cellNumberInput = $formInputTmpl.clone().attr({
      id: "cellphone-number",
      name: "user_mobile_number",
      placeholder: "",
      type: "tel",
    });

    const $emailLabel = getLabel("Email address");
    const $emailInput = $formInputTmpl.clone().attr({
      id: "email-address",
      name: "user_email_address",
      placeholder: "",
      type: "email",
    });

    const $describeIssueLabel = getLabel("Describe your issue");
    const $describeIssueTextarea = $textAreaTmpl.clone().attr({
      id: "describe-your-issue",
      name: "description",
      placeholder: "Please describe your issue",
    });

    const $submitButton = $(".components .button.button--form-submit")
      .clone()
      .attr({
        value: "Submit",
      });

    $yourInfoFieldset.append([
      $yourInfoLegend,
      $firstNameLabel,
      $firstNameInput,
      $lastNameLabel,
      $lastNameInput,
      $cellNumberLabel,
      $cellNumberInput,
      $emailLabel,
      $emailInput,
      $describeIssueLabel,
      $describeIssueTextarea,
      $submitButton,
    ]);

    $requiredFieldsNote.text("* Required fields");

    $form.append([
      $requiredFieldsNote,
      $serviceAreaFieldset,
      $addressFieldset,
      $yourInfoFieldset,
    ]);

    $submitButton.on("click", (event) => {
      event.preventDefault();
      api
        .submitServiceRequest($form.serialize())
        .then(() => {
          this.$element.empty().append(new ServiceRequestSubmitted().render());
        })
        .fail((a, b) => {
          this.$element.empty().append(
            new StatusMessage({
              text: "Error while submitting service request.",
              status: "failure",
            }).render()
          );
          console.error(a, b);
        });
    });

    this.$element = new FullWidthGrid([$form]).render();
  }

  render() {
    return this.$element;
  }
}
