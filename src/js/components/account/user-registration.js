import { API } from "../../api";
import {
  getDiv,
  getForm,
  getInput,
  getLabel,
  getSubmitButton,
} from "../../utils/element-factory";

function formatError(jqXHR) {
  let message = "";
  console.log(jqXHR);
  if (jqXHR.status === 400) {
    Object.keys(jqXHR.responseJSON).forEach((fieldName) => {
      message += `${fieldName}:\n${jqXHR.responseJSON[fieldName].join("\n")}\n\n`;
    });
    message += "Please try again or contact support with this message.";
  } else {
    message = "An error occurred. Please try again.";
    console.error(jqXHR.responseText);
  }
  return message;
}

export class UserRegistration {
  constructor() {
    const $successTemplate = $(".styles .form-styles .w-form-done").first().clone();
    const $failTemplate = $(".styles .form-styles .w-form-fail").first().clone();

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
    $fail.hide();
    $fail.find("div").empty().css("white-space", "pre-wrap");
    const response = api.registerUser(endPoint, $form.serialize());
    response
      .done((response, textStatus) => {
        if (textStatus === "success") {
          $form.hide();
          $success.show();
        }
      })
      .fail((jqXHR, textStatus) => {
        try {
          $fail.find("div").text(formatError(jqXHR));
          $fail.show();
          $fail[0].scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
          console.error(e);
          alert("An error occurred. Please try again or contact support.");
        }
      });
  }

  render() {
    return this.$element;
  }
}
