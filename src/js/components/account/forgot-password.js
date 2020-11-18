import { API } from "../../api";
import {
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";

export class ForgotPassword {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").clone();

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/send-reset-password-link/";

    const $forgotFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Send Reset Link");

    const $formElementsContainer = $("<div />");
    $formElementsContainer.append(getLabel("email"));
    $formElementsContainer.append(getInput("email", "email"));

    $form.append($formElementsContainer);
    $form.append($submitButton);

    $forgotFormContainer.append($form);
    $forgotFormContainer.append($successTemplate);
    $forgotFormContainer.append($failTemplate);

    $form.submit((event) => {
      event.preventDefault();
      this.sendResetLink(endPoint, $form, $successTemplate, $failTemplate);
    });

    this.$element = $forgotFormContainer;
  }

  /**
   * Calls API end point to send a password reset link to the user
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  sendResetLink(endPoint, $form, $success, $fail) {
    const api = new API();
    const response = api.sendResetLink(endPoint, $form.serialize());
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
