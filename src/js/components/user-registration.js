import { API } from "../api";
import {
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../utils/element-factory";

export class UserRegistration {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").clone();

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/register/";
    const fields = [
      {
        label: "email",
        type: "email",
      },
      {
        label: "username",
        type: "text",
      },
      {
        label: "password",
        type: "password",
      },
      {
        label: "password confirm",
        type: "password",
      },
    ];

    const $registrationFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Register");

    fields.forEach((field) => {
      const $formElementsContainer = $("<div />");
      $formElementsContainer.append(getLabel(field.label));
      $formElementsContainer.append(getInput(field.type, field.label));
      $form.append($formElementsContainer);
    });

    $form.append($submitButton);

    $registrationFormContainer.append($form);
    $registrationFormContainer.append($successTemplate);
    $registrationFormContainer.append($failTemplate);

    $form.submit((event) => {
      event.preventDefault();
      this.registerUser(endPoint, $form, $successTemplate, $failTemplate);
    });

    this.$element = $registrationFormContainer;
  }

  /**
   * Calls API providing the details of a new user to register
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  registerUser(endPoint, $form, $success, $fail) {
    const api = new API();
    const response = api.registerUser(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $form.hide();
          $success.show();
        }
      })
      .fail((jqXHR, textStatus) => {
        $form.hide();
        $fail.show();
        console.error(jqXHR, textStatus);
      });
  }

  render() {
    return this.$element;
  }
}
