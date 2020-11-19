import { API } from "../../api";
import { setMenuState } from "../../utils/menu";
import {
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";

export class Login {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").clone();

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/login/";
    const fields = [
      {
        label: "login",
        type: "text",
      },
      {
        label: "password",
        type: "password",
      },
    ];
    const $loginFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Login");

    fields.forEach((field) => {
      const $formElementsContainer = $("<div />");
      $formElementsContainer.append(getLabel(field.label));
      $formElementsContainer.append(getInput(field.type, field.label));
      $form.append($formElementsContainer);
    });

    $form.append($submitButton);

    $loginFormContainer.append($form);
    $loginFormContainer.append($successTemplate);
    $loginFormContainer.append($failTemplate);

    $form.submit((event) => {
      event.preventDefault();
      this.login(endPoint, $form, $successTemplate, $failTemplate);
    });

    this.$element = $loginFormContainer;
  }

  /**
   * Calls API providing user login details and attempts a login via
   * the API.
   * @param {String} endPoint - the API endpoint
   * @param {jqObject} $form - the form to submit
   * @param {jqObject} $success - reference to the success template
   * @param {jqObject} $fail  - reference to the failure template
   */
  login(endPoint, $form, $success, $fail) {
    const api = new API();
    const response = api.login(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          localStorage.setItem("user", response.token);
          $form.hide();
          $success.empty().append("You are now logged in").show();
          setMenuState();
        }
      })
      .fail((jqXHR, textStatus) => {
        $form.hide();
        $fail
          .empty()
          .append("Error while communicating with the server")
          .show();
        console.error(jqXHR, textStatus);
      });
  }

  render() {
    return this.$element;
  }
}
