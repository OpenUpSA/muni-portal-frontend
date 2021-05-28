import { API } from "../../api";
import { TASK_TYPES } from "../constants";
import { FullWidthGrid } from "../grid";
import { ServiceRequestSubmitted } from "./service-request-submitted";
import { StatusMessage } from "../molecules/status-message";
import {
  createImageFormFields,
  getFormDataFromArray,
  updateUploadedFiles,
} from "./images";
import {
  getForm,
  getHiddenField,
  getLabel,
  getSectionHeading,
} from "../../utils/element-factory";

export class SubmitServiceRequest {
  constructor() {
    const api = new API();

    let uploadedFiles = {};

    const $form = getForm("", "post", "submit-service-request");
    // we cannot just clone the entire Webflow form but, everything
    // else hangs off it so, we get it here to use as the context
    // for other querySelectors
    const $webflowForm = $(".components .form__inner");

    const $requiredFieldsNote = $(".components .form-item .form-label").clone();

    const $submitButton = $(".components .button.button--form-submit")
      .clone()
      .attr({
        value: "Submit",
      });

    $requiredFieldsNote.text("* Required fields");

    $form.append([
      $requiredFieldsNote,
      getSectionHeading("Issue details"),
      ...this.getServiceAreaField($webflowForm),
      ...this.getDescribeIssueField($webflowForm),
      getSectionHeading("Issue location"),
      ...this.getIssueLocation($webflowForm),
      ...this.getLocationPicker($webflowForm),
      getSectionHeading("Your information"),
      ...this.getUserDetails($webflowForm),
      getSectionHeading("Attach photos"),
      ...this.getImages($webflowForm, uploadedFiles),
      $submitButton,
    ]);

    $submitButton.on("click", (event) => {
      if ($form[0].reportValidity()) {
        event.preventDefault();
        $submitButton
          .attr({ value: "Submitting...", disabled: true })
          .addClass("button--disabled");
        api
          .submitServiceRequest($form.serialize())
          .then((response) => {
            const serviceRequestId = response.id;
            api
              .submitServiceRequestFiles(
                serviceRequestId,
                getFormDataFromArray(uploadedFiles)
              )
              .done(() => {
                this.$element
                  .empty()
                  .append(new ServiceRequestSubmitted().render());
              });
          })
          .fail((a, b) => {
            this.$element.empty().append(
              new StatusMessage({
                text: "Error while submitting service request.",
                status: "failure",
              }).render()
            );
            $submitButton
              .attr({ value: "Submit", disabled: false })
              .removeClass("button--disabled");
            console.error(a, b);
          });
      }
    });

    this.$element = new FullWidthGrid([$form]).render();
  }

  getDescribeIssueField($webflowForm) {
    const $textAreaTmpl = $webflowForm.find(".form__input-field--large");

    const $describeIssueLabel = getLabel($webflowForm, {
      htmlFor: "describe-your-issue",
      text: "Describe your issue * (maximum of 1024 characters)",
    });
    const $describeIssueTextarea = $textAreaTmpl.clone().attr({
      id: "describe-your-issue",
      maxLength: 1024,
      name: "description",
      required: true,
      placeholder: "Please describe your issue",
    });

    return [$describeIssueLabel, $describeIssueTextarea];
  }

  /**
   * Returns the service area form field
   * @param {jqObject} $webflowForm - The base webflow form jQuery object
   * @returns The service ara field component as a jQuery object
   */
  getServiceAreaField($webflowForm) {
    const $dropdownContainer = $(".components .dropdown:eq(0)").clone();
    const $dropdownCurrentSelection = $dropdownContainer.find(
      ".dropdown__current-selection"
    );
    const $dropdownList = $dropdownContainer.find(".w-dropdown-list");
    const $dropdownOption = $dropdownContainer.find(".w-dropdown-link");
    const $typeHiddenField = getHiddenField({
      id: "service-area",
      name: "type",
    });

    const $serviceAreaLegend = getLabel($webflowForm, {
      htmlFor: "",
      text: "Service area of request *",
    });

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

    return [$serviceAreaLegend, $typeHiddenField, $dropdownContainer];
  }

  getIssueLocation($webflowForm) {
    const $webflowInputBlock = $webflowForm.find("> .form__input-block");

    const $streetNameLabel = getLabel($webflowForm, {
      htmlFor: "street-name",
      text: "Street name (maximum of 254 characters)",
    });

    const $streetNameInput = $webflowInputBlock.find("input").clone().attr({
      id: "street-name",
      maxLength: 254,
      name: "street_name",
      placeholder: "",
    });

    const $streetNumberLabel = getLabel($webflowForm, {
      htmlFor: "street-number",
      text: "Street Number (maximum of 254 characters)",
    });
    const $streetNumberInput = $webflowInputBlock.find("input").clone().attr({
      id: "street-number",
      maxLength: 254,
      name: "street_number",
      type: "number",
      placeholder: "",
    });

    const $townLabel = getLabel($webflowForm, {
      htmlFor: "town",
      text: "Town (maximum of 254 characters)",
    });
    const $townInput = $webflowInputBlock.find("input").clone().attr({
      id: "town",
      maxLength: 254,
      name: "suburb",
      placeholder: "",
    });

    return [
      $streetNameLabel,
      $streetNameInput,
      $streetNumberLabel,
      $streetNumberInput,
      $townLabel,
      $townInput,
    ];
  }

  getUserDetails($webflowForm) {
    const $webflowInputBlock = $webflowForm.find("> .form__input-block");

    const $firstNameLabel = getLabel($webflowForm, {
      htmlFor: "first-name",
      text: "First name * (maximum of 254 characters)",
    });
    const $firstNameInput = $webflowInputBlock.find("input").clone().attr({
      id: "first-name",
      maxLength: 254,
      name: "user_name",
      placeholder: "",
      required: true,
    });

    const $lastNameLabel = getLabel($webflowForm, {
      htmlFor: "last-name",
      text: "Last name * (maximum of 254 characters)",
    });
    const $lastNameInput = $webflowInputBlock.find("input").clone().attr({
      id: "last-name",
      maxLength: 254,
      name: "user_surname",
      placeholder: "",
      required: true,
    });

    const $cellNumberLabel = getLabel($webflowForm, {
      htmlFor: "cell-number",
      text: "Cell Number * (maximum of 30 numbers)",
    });
    const $cellNumberInput = $webflowInputBlock.find("input").clone().attr({
      id: "cellphone-number",
      maxLength: 30,
      name: "user_mobile_number",
      placeholder: "",
      required: true,
      pattern: "[0-9]{1,30}",
      type: "tel",
    });

    const $emailLabel = getLabel($webflowForm, {
      htmlFor: "email-address",
      text: "Email address (maximum of 254 characters)",
    });
    const $emailInput = $webflowInputBlock.find("input").clone().attr({
      id: "email-address",
      maxLength: 254,
      name: "user_email_address",
      placeholder: "",
      type: "email",
    });

    return [
      $firstNameLabel,
      $firstNameInput,
      $lastNameLabel,
      $lastNameInput,
      $cellNumberLabel,
      $cellNumberInput,
      $emailLabel,
      $emailInput,
    ];
  }

  getImages($webflowForm, uploadedFiles) {
    const {
      $uploadImagesInput,
      $uploadImagesClass,
      $uploadImagePreviewTemplate,
    } = createImageFormFields();

    function handleInputFilesChanged() {
      updateUploadedFiles(
        this.files,
        uploadedFiles,
        $uploadImagePreviewTemplate,
        $uploadImagesClass
      );
    }

    $uploadImagesInput.change(handleInputFilesChanged);

    return [$uploadImagesInput, $uploadImagesClass];
  }

  getLocationPicker($webflowForm) {
    const $coordinatesField = getHiddenField({
      id: "service-request-coordinates",
      name: "coordinates",
    });
    const $locationPickerLabel = getLabel($webflowForm, {
      htmlFor: "",
      text: "Locate your issue on a map",
    });
    const $locationPickerContainer = $(".components > .location-picker")
      .clone()
      .attr("id", "service-request-location-picker");
    // temporary until updated in Webflow
    // map-contols needs to change to map-controls
    $locationPickerContainer
      .find(".map-container .map-contols")
      .css("z-index", 9999);

    // temporary until updated in Webflow
    $locationPickerContainer
      .find(".map-container .map-pin")
      .css("z-index", 9999);

    return [$locationPickerLabel, $coordinatesField, $locationPickerContainer];
  }

  render() {
    return this.$element;
  }
}
