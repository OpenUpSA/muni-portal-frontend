import { API } from "../../api";
import {
  getAnchorElement,
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";

export class ResetPassword {
  constructor() {
    const $successTemplate = $(".components .form-styles .w-form-done").clone();
    const $failTemplate = $(".components .form-styles .w-form-fail").clone();
    const $loginAnchor = getAnchorElement(
      "/accounts/login/",
      "link-text form-submit",
      "Please log in with your new password"
    );
    $loginAnchor.hide();

    // we cannot just clone the entire Webflow form but, everything
    // else hangs off it so, we get it here to use as the context
    // for other querySelectors
    const $webflowForm = $(".components .form__inner");

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/reset-password/";

    const $resetFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Update password");

    const $formElementsContainer = $("<div />");
    $formElementsContainer.append(
      getLabel($webflowForm, {
        htmlFor: "my-muni-password",
        text: "New password",
      })
    );
    $formElementsContainer.append(getInput("password", "password"));

    // Add security values as hidden inputs and populate from query params
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach(function (value, key) {
      $formElementsContainer.append(getInput("hidden", key, value));
    });

    $form.append($formElementsContainer);
    $form.append($submitButton);

    $resetFormContainer.append($form);
    $resetFormContainer.append($successTemplate);
    $resetFormContainer.append($failTemplate);
    $resetFormContainer.append($loginAnchor);

    $form.submit((event) => {
      event.preventDefault();
      this.resetPassword(
        endPoint,
        $form,
        $successTemplate,
        $failTemplate,
        $loginAnchor
      );
    });

    this.$element = $resetFormContainer;
  }

  /**
   * Calls API end point to set a new password for the user
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   * @param {jqObject} $loginAnchor - reference to the login anchor
   */
  resetPassword(endPoint, $form, $success, $fail, $loginAnchor) {
    const api = new API();
    const response = api.resetPassword(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $form.hide();
          $success
            .empty()
            .append(`Your password was changed successfully.`)
            .show();
          $loginAnchor.show();
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
