import { API } from '../../api';
import { setMenuState } from "../../utils/menu";
import {
  getAnchorElement,
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";

import QuickLinksBlock from "./molecules/quick-links-block";

export class Login {
  constructor() {
    const $successTemplate = $(".components .form-styles .w-form-done").clone();
    const $failTemplate = $(".components .form-styles .w-form-fail").clone();

    const defaultBaseUrl = "https://muni-portal-backend.openup.org.za";
    const endPoint = "/api/accounts/login/";
    const fields = [
      {
        label: "Username",
        type: "text",
        name: "login",
      },
      {
        label: "Password",
        type: "password",
      },
    ];
    const $loginFormContainer = getDiv("form w-form");
    const $form = getForm(`${defaultBaseUrl}${endPoint}`, "post");
    const $submitButton = getSubmitButton("Login");

    fields.forEach((field) => {
      const $formElementsContainer = $("<div />");
      $formElementsContainer.append(getLabel(field.label));
      $formElementsContainer.append(
        getInput(field.type, field.label, "", null, field.name)
      );
      $form.append($formElementsContainer);
    });

    $form.append($submitButton);

    $loginFormContainer.append($successTemplate);
    $loginFormContainer.append($failTemplate);

    $form.append(new QuickLinksBlock().render());
    $loginFormContainer.append($form);

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
          localStorage.setItem("accessToken", response.token.access);
          localStorage.setItem("refreshToken", response.token.refresh);
          setMenuState();

          $form.hide();
          $fail.hide();
          $success.empty().append("You are now logged in").show();

          window.location = "/services/";
        }
      })
      .fail((jqXHR, textStatus) => {
        $form[0].reset();

        let errorMessage = "Error while communicating with the server";
        if (jqXHR.status === 400) {
          errorMessage = jqXHR.responseJSON.detail;
        }
        $fail.empty().append(errorMessage).show();
        console.error(jqXHR, textStatus)
      });
  }

  render() {
    return this.$element;
  }
}
