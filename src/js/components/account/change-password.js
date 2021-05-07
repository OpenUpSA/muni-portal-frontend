import { API } from "../../api";
import {
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";

export class ChangePassword {
  constructor() {
    const $successTemplate = $(".components .form-styles .w-form-done").clone();
    const $failTemplate = $(".components .form-styles .w-form-fail").clone();

    // we cannot just clone the entire Webflow form but, everything
    // else hangs off it so, we get it here to use as the context
    // for other querySelectors
    const $webflowForm = $(".components .form__inner");

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/change-password/";

    const $changeFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Change Password");

    const $formElementsContainer = $("<div />");
    $formElementsContainer.append(
      getLabel($webflowForm, {
        htmlFor: "my-muni-old_password",
        text: "Current password",
      })
    );
    $formElementsContainer.append(getInput("password", "old_password"));

    $formElementsContainer.append(
      getLabel($webflowForm, {
        htmlFor: "my-muni-password",
        text: "New password",
      })
    );
    $formElementsContainer.append(getInput("password", "password"));

    $formElementsContainer.append(
      getLabel($webflowForm, {
        htmlFor: "my-muni-password_confirm",
        text: "Confirm new password",
      })
    );
    $formElementsContainer.append(getInput("password", "password_confirm"));

    $form.append($formElementsContainer);
    $form.append($submitButton);

    $changeFormContainer.append($successTemplate);
    $changeFormContainer.append($failTemplate);
    $changeFormContainer.append($form);

    $form.submit((event) => {
      event.preventDefault();
      this.changePassword(endPoint, $form, $successTemplate, $failTemplate);
    });

    this.$element = $changeFormContainer;
  }

  /**
   * Calls API end point to change user's password
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  changePassword(endPoint, $form, $success, $fail) {
    const api = new API();
    const response = api.changePassword(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $form.hide();
          $success
            .empty()
            .append("Your password has been changed successfully.")
            .attr("tabindex", -1)
            .show()
            .focus();
        }
      })
      .fail((jqXHR, textStatus) => {
        $form[0].reset();
        if (jqXHR.status === 400) {
          $(".change-password-field-error").remove();
          for (const [fieldName, error] of Object.entries(jqXHR.responseJSON)) {
            const $input = $("input[name='" + fieldName + "']");
            const $failClone = $fail
              .clone()
              .addClass("change-password-field-error")
              .insertBefore($input[0]);
            $failClone
              .empty()
              .append(`${error}`)
              .attr("tabindex", -1)
              .show()
              .focus();
          }
        } else {
          const errorMessage = "Error while communicating with the server";
          $fail
            .empty()
            .append(errorMessage)
            .attr("tabindex", -1)
            .show()
            .focus();
        }
        console.error(jqXHR, textStatus);
      });
  }

  render() {
    return this.$element;
  }
}
