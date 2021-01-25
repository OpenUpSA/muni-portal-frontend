import { API } from "../../api";
import {
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton
} from "../../utils/element-factory";

export class ResetPassword {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").clone();

    // TODO: Is this necessary? why not set the default in api.js?
    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/reset-password/";

    const $resetFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Set New Password");

    const $formElementsContainer = $("<div />");
    $formElementsContainer.append(getLabel("new password"));
    $formElementsContainer.append(getInput("password", "password"));

    $form.append($formElementsContainer);
    $form.append($submitButton);

    $resetFormContainer.append($form);
    $resetFormContainer.append($successTemplate);
    $resetFormContainer.append($failTemplate);

    $form.submit((event) => {
      event.preventDefault();
      this.resetPassword(endPoint, $form, $successTemplate, $failTemplate);
    });

    this.$element = $resetFormContainer;
  }

  /**
   * Calls API end point to set a new password for the user
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  resetPassword(endPoint, $form, $success, $fail) {
    const api = new API();
    const response = api.resetPassword(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $form.hide();
          $success
            .empty()
            .append(
              "Your password was changed successfully."
            )
            .show();
        }
      })
      .fail((jqXHR, textStatus) => {
        $form.hide();
        $fail
          .empty()
          .append(
            "Something went wrong while communicating with the server. Please try again or contact support."
          )
          .show();
        console.error(jqXHR, textStatus);
      });
  }

  render() {
    return this.$element;
  }
}